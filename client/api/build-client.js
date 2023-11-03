import axios from 'axios';

const buildClient = ({ req }) => {
    if (typeof window === 'undefined') {
        // We are on the server
        // Requests should be made to http://ingress-nginx-controller.ingress-nginx.svc.cluster.local or a domain name.....
        return axios.create({
            baseURL: 'http://ticketing-app-prod.space',
            headers: req.headers
        });
    } else {
        // We are on the browser
        // Requests can be made with a base url of ''
        return axios.create({
            baseURL: '/'
        });
    }
};

export default buildClient;
