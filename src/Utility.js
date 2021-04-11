import axios from "axios";

const url = "http://www.i2ce.in/reviews";

class Api {
  async get(link) {
    let res = await axios.get(url + link);
    // console.log(res.data);
    return res.data;
  }
}

const Rest = new Api();
export default Rest;
