import Axios from 'axios';

export default class KeepaService {
    static async findProduct(asin) {
        try {
            let token = `82stsotg8m0qivjvcbsvn08f1t229kilkljgvi6057buv80631tbtlgdvtinj6e9`;
            let url = `https://api.keepa.com/product?key=${token}&domain=5&asin=${asin}`;
            let res = await Axios.post(url);
            if (res && res.status === 200 && res.data.products.length > 0) {
                let listProduct = res.data.products;
                let productData = listProduct[0];
                let features = '';
                if (Array.isArray(productData.features)) {
                    productData.features.map((item) => {
                        features += item + '\n';
                    });
                } else {
                    features = productData.features;
                }
                productData = {
                    asin,
                    url: `https://www.amazon.co.jp/dp/${asin}`,
                    name: productData.title,
                    category_id: productData.categories[0],
                    images:
                        (productData.imagesCSV && productData.imagesCSV.split(',').map((item) => 'https://images-na.ssl-images-amazon.com/images/I/' + item)) ||
                        [],
                    description: features,
                    description: (productData.description && productData.description.replace(/\n+/g, '\n')) || features,
                    price: 0,
                };
                return {
                    status: 'SUCCESS',
                    data: productData,
                };
            }
            console.log(' ####### KeepaService: ', res.status);
            return {
                status: 'ERROR',
                message: 'Product not found.!',
            };
        } catch (error) {
            console.log(' ####### KeepaService: ', error);
            return {
                status: 'ERROR',
                message: 'Keepa: ' + error.message,
            };
        }
    }
}
