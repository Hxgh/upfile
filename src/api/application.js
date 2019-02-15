/* eslint-disable no-unused-vars */
import axios from '@/utils/axios';

export const applicationList = (params) => {
    return axios.request({
        url: '/upload/applist',
        method: 'GET',
        params: params
    })
}

export const applicationDel = (params) => {
    return axios.request({
        url: '/upload/delapp',
        method: 'DELETE',
        params: params
    })
}

export const applicationSave = (data) => {
    let method = data.id ? 'PUT' : 'POST';
    let url = data.id ? '/upload/editapp' : '/upload/addapp';
    return axios.request({
        url: url,
        method: method,
        data: data
    })
}