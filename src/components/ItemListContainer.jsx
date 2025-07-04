import "../App.css";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import { useParams } from "react-router-dom";
import ItemList from "./ItemList";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../service/firebase";

const ItemListContainer = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    setCategoryError(false);
    const productsCollection = categoryId
      ? query(collection(db, "products"), where("category", "==", categoryId))
      : collection(db, "products");
    getDocs(productsCollection)
      .then((res) => {
        const list = res.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        if (list.length === 0) {
          setCategoryError(true);
          setData([]);
        } else {
          setCategoryError(false);
          setData(list);
        }
      })
      .catch((error) => {
        setCategoryError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId]);

  return (
    <>
      {loading && (
        <div className="loading-modal">
          <span
            className="spinner-border spinner"
            role="status"
            aria-hidden="true"
          ></span>
          <span className="loading-text"> Cargando productos...</span>
        </div>
      )}
      <div>
        {!loading && categoryError && (
          <Alert variant="danger">
            <Alert.Heading className="text-danger alert-heading">
              <span>Categoría no encontrada</span>
            </Alert.Heading>
            <p>
              La categoría{" "}
              <b>{categoryId && <span>{categoryId.toUpperCase()}</span>}</b> no
              existe o no tiene productos.
            </p>
          </Alert>
        )}
        {!loading && !categoryError && (
          <>
            <Alert variant="success">
              <Alert.Heading className="text-danger">
                <span>{props.saludo}</span>
                <span className="header-tiutlo">
                  {" "}
                  {categoryId && categoryId.toUpperCase()}
                </span>
              </Alert.Heading>
            </Alert>
            <ItemList data={data} />
          </>
        )}
      </div>
    </>
  );
};
export default ItemListContainer;
