import React, { useState, useEffect } from "react";
import "./App.css";
import Rest from "./Utility";
import { Pagination, Rate } from "antd";
import "antd/dist/antd.css";

function App() {
  const [product, setProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [indexFrom, setIndexFrom] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [filterToggle, setFilterToggle] = useState(false);
  const [formData, setFormData] = useState({
    productId: 20,
    viewerId: 4,
  });

  const { productId, viewerId } = formData;
  const handleChange = (page) => {
    console.log(page, "page");
    setCurrentPage(page);
    setIndexFrom((page - 1) * 3);
  };

  useEffect(() => {
    (async () => {
      let products = await Rest.get(`/${productId}/${viewerId}`);
      setProduct(products.reviews);
    })();
  }, [productId,viewerId]);

  const sortRate = () => {
    product.sort((a, b) => {
      if (a.ratings.Overall > b.ratings.Overall) {
        return -1;
      }
      if (a.ratings.Overall < b.ratings.Overall) {
        return 1;
      }
      return 0;
    });
  };

  const sortUsefulness = () => {
    product.sort((a, b) => {
      if (a.usefulness < b.usefulness) {
        return -1;
      }
      if (a.usefulness > b.usefulness) {
        return 1;
      }
      return 0;
    });
  };

  const sortConnection = () => {
    product.sort((a, b) => {
      if (a.reviewer.connection_level < b.reviewer.connection_level) {
        return -1;
      }
      if (a.reviewer.connection_level > b.reviewer.connection_level) {
        return 1;
      }
      return 0;
    });
  };

  const idChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // console.log(product);
  return (
    <div className="App">
      <form onSubmit={submit}>
        <label>Product Id : </label>
        <input
          type="text"
          placeholder="product_id/20"
          name="productId"
          value={productId}
          onChange={(e) => idChange(e)}
        />
        <label>Viewers Id : </label>
        <input
          type="text"
          placeholder="viewer_id/10"
          name="viewerId"
          value={viewerId}
          onChange={(e) => idChange(e)}
        />
      </form>
      <div>
        {filterToggle ? (
          <div
            className="filter-content"
            onClick={() => setFilterToggle(false)}
          >
            <p onClick={sortRate}>Overall Rating</p>
            <p onClick={sortConnection}>Connection Level</p>
            <p onClick={sortUsefulness}>Usefulness</p>
          </div>
        ) : (
          <button className="button" onClick={() => setFilterToggle(true)}>
            FILTER BY :
          </button>
        )}
      </div>
      {product
        .slice(indexFrom, indexFrom + 3)
        .filter((item) => item.friend === true)
        .map((item, i) => {
          console.log(item.ratings.Overall);
          return (
            <div className="product" key={item.user_id}>
              <h2>{item.reviewer.name}</h2>
              <h3>{item.title}</h3>
              <p>Review: {item.comment}</p>
              <p>Usefulness: {item.usefulness}</p>
              <p>Overall Rating : {item.ratings.Overall}</p>
              <p>Connection Level :{item.reviewer.connection_level}</p>
              {toggle ? (
                <div>
                  {Object.entries(item.ratings).map(([key, value], i) => {
                    return (
                      <div key={i}>
                        <ul>
                          {" "}
                          <li>
                            {key}----
                            <Rate defaultValue={value} />
                          </li>
                        </ul>
                      </div>
                    );
                  })}

                  <button className="button" onClick={() => setToggle(false)}>
                    Show Less
                  </button>
                </div>
              ) : (
                <button className="button" onClick={() => setToggle(true)}>
                  More
                </button>
              )}
            </div>
          );
        })}
      <Pagination
        current={currentPage}
        onChange={handleChange}
        total={product.filter((item) => item.friend === true).length}
        pageSize={3}
      />
    </div>
  );
}

export default App;
