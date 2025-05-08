/* eslint-disable no-useless-catch */
import api, { BASE_URL } from "@/configs/axios";
import endPoint from "./endPoint";

/************************************************************************************************************************************************************************************************************************************************************************************************************************/
/* AUTH START */
export const LoginAPI = async (loginData) => {
  try {
    const { data } = await api.post(`${endPoint.login}`, loginData);
    return data;
  } catch (error) {
    throw error;
  }
};

/* AUTH END */
/************************************************************************************************************************************************************************************************************************************************************************************************************************/
/* DASHBOARD  START */

export const GetDashboardAPI = async (params) => {
  try {
    const { data } = await api.get(`${endPoint.getDashboardData}`, {
      params: params,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

/* DASHBOARD  END */
/************************************************************************************************************************************************************************************************************************************************************************************************************************/
/* COUNTERSALES  START */

export const CreateCounterSalesAPI = async (loginData) => {
  try {
    const { data } = await api.post(
      `${endPoint.createCounterSales}`,
      loginData,
    );
    return data;
  } catch (error) {
    throw error;
  }
};
/* COUNTERSALES  END */
/************************************************************************************************************************************************************************************************************************************************************************************************************************/
/* ITEM MASTER  START */

export const CreateItemAPI = async (loginData) => {
  try {
    const { data } = await api.post(`${endPoint.createItem}`, loginData);
    return data;
  } catch (error) {
    throw error;
  }
};
export const GetItemsAPI = async (params) => {
  try {
    const { data } = await api.get(`${endPoint.getItems}`, {
      params: params,
    });
    return data;
  } catch (error) {
    throw error;
  }
};
/* ITEM MASTER  END */
/************************************************************************************************************************************************************************************************************************************************************************************************************************/
