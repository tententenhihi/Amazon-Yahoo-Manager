import Axios from 'axios';

export default class KeepaService {
    static async findProduct(asin, idUser) {
        try {
            let token = `82stsotg8m0qivjvcbsvn08f1t229kilkljgvi6057buv80631tbtlgdvtinj6e9`;
            let url = `https://api.keepa.com/product?key=${token}&domain=5&asin=${asin}`;
            let res = await Axios.post(url);
            if (res && res.status === 200) {
                let listProduct = res.data.products;
                listProduct = listProduct.map((item) => {
                    return {
                        asin,
                        idUser,
                        url: 'keepa',
                        name: item.title,
                        price: item.title,
                        name: item.title,
                        name: item.title,
                        name: item.title,
                        name: item.title,
                        name: item.title,
                        name: item.title,
                        name: item.title,
                        name: item.title,
                    };
                });
                return {
                    status: 'SUCCESS',
                    data: listProduct,
                };
            }
        } catch (error) {
            return {
                status: 'ERROR',
                message: 'Keepa: ' + error.message,
            };
        }
    }
}
