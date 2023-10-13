import 'bootstrap/dist/css/bootstrap.css';

const appComponent = ({ Component, pageProps }) => {
    return <Component { ...pageProps } />
};

export default appComponent;
