/* eslint-disable no-unused-vars */
import axios from '@/utils/axios';

export const strategyList = (params) => {
    return axios.request({
        url: '/upload/stralist',
        method: 'GET',
        params: params
    })
}

export const strategyDel = (params) => {
    return axios.request({
        url: '/upload/delstra',
        method: 'DELETE',
        params: params
    })
}

export const strategySave = (data) => {
    let method = data.id ? 'PUT' : 'POST';
    let url = data.id ? '/upload/editstra' : '/upload/addstra';
    return axios.request({
        url: url,
        method: method,
        data: data
    })
}

export const strategyTree = (params) => {
    return axios.request({
        url: '/upload/three',
        method: 'GET',
        params: params
    })
}