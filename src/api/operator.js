/* eslint-disable no-unused-vars */
import axios from '@/utils/axios';

export const operatorList = (params) => {
    return axios.request({
        url: '/upload/serlist',
        method: 'GET',
        params: params
    })
}

export const operatorDel = (params) => {
    return axios.request({
        url: '/upload/delser',
        method: 'DELETE',
        params: params
    })
}

export const operatorSave = (data) => {
    let method = data.id ? 'PUT' : 'POST';
    let url = data.id ? '/upload/editser' : '/upload/addser';
    return axios.request({
        url: url,
        method: method,
        data: data
    })
}