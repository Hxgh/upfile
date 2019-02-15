/* eslint-disable no-unused-vars */
import axios from '@/utils/axios';

export const api_login = (data) => {
    return axios.request({
        url: '/login',
        method: 'post',
        data: data
      })
}