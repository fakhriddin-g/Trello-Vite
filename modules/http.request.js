import axios from "axios"

const baseURL = import.meta.env.VITE_BASE_URL

const enums = {
  get: "get",
  post: "post",
  patch: "patch",
  put: "put",
  delete: "delete"
}

export const useHttp = () => {
  const request = async (url, method, body = null) => {
    if(!enums[method]) {
      throw new Error('Axios has not provide methode ' + method)
    }

    try {
      const res = await axios[method](baseURL + url, body)

      if (res.status === 200 || res.status === 201) {
        return res.data
      }
    } catch (error) {
      return error
    }
  }

  return {
    request
  }

}