import Response from '../utils/Response';
import ProductYahooService from '../services/ProductYahooService';
import AuctionYahooService from '../services/AuctionYahooService';
import UploadFile from '../helpers/UploadFile';
import UserService from '../services/UserService';
import ProxyService from '../services/ProxyService';
import AccountYahooService from '../services/AccountYahooService';

export default class ProductYahooController {
    static async getPhoto(req, res) {
        let response = new Response(res);
        try {
            let yahoo_account = {
                cookie: `XA=9bku5b1ge3obc&t=1625416044&u=1625416131&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1vaGsvVOX5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUel+8fM6ODlowrMAqU4wOP/6/0; XC=8TEBDn1OZxW7cUAnlLaDFBYSHLSm7SsymIeH0XtQ0wWmEFqTL2fZkZFjtlkA7C6ENFp9pjKziBlEsHwFJxXRQxgoW71SUnn6sQQR2BwqgeXwVjQQ2EOWUXbC8Xdtzj1DVg+xAfcb9tsSBHfWfcM8KeL1c7bQs9q6fq9J3eEPbeZqd1I7cQIAT9scjvLG/MTf+q1VujCP8KK+34dZZO+2YJ9vnSo5RXYOFn5z7nrlP406B70S1lqqHxtLQAmFRQKwxhVIb76RJiYfB+fO6M8FGBXfOqqmv1Q6i7WJRdDtMbJDrjHfkAEDR6bEH7eUc4gRCCLqyAUznEB3DcTtPY6ZvGGbYK+VxGq+Pc5bxdsB6uQaAjOxSl2Y5ROMC+PJfvLeRZhCxHekfWjUcnBBJZ1COSRWR6ZDLcFAmaTzqSEMY13HwckHF3Xn6giFMkzkB1izhxomV1LrfyIWN0AhJ04YYOHIn+8v1qgHN/uu8huFAO1lUSZCNCNSDQdyi9hHI9tqJXEJgaHRUeGX6KbF2gQervizp+y3eVZNJ00Nak/5yRt7bPcAdG/QXHNJ7BUEnL6F+ywBhb+uipUsaF53T4bj1w==.1; SSL=v=1&s=BNl3PbVChVjSljAPzazmwf86LiQVs8WQPs4YuPrCEAT_vBST8CuD0XBwoMvbIDGjxkuaHa7cDpoYgQZqaO3WFg--&kv=0; Y=v=1&n=50l0olb9bec3l&l=4n55axsvxv/o&p=m2mvvjp012000000&ig=00b2j&r=18k&lg=ja-JP&intl=jp; _n=cGqXa8MFQs3ITa7NVfN3SI_uPNOsj-OkAAq89Sw8WzB3djlqQuW7m01ihhrp0XJOSxSgcDgmjTQ_1ZUbaBathsGG7UMoagatmC-tZPJ1JEZ69Qi_rw3YjOhoVhbAiEx9zpm-nESRk6hsQl1O8yQcjRuoOUsdnxq9uwc9B-WaaZNpWo7Htxy1Qm8_DrFTFNBiNcq8HhkMN1WtfKrG5f_RKk2QuICeUsW_iMhQTzDcQGzCFoyzaFvVAjktle7eDO627yWYV3srPH2YczPNZnJIGYlHxZAF9V-Tk-AIS1L69xFC52WVa-mP2yJ1zO03SZ37x_J8u9yKL_N7idhomko7sPoBr99_KLUCcGZx56Sd8GnjzJVjRQJcGxgeOn1-0OG3CIQ0VgUzbqIP8wljffkslLh236oh7rGx3rsOTDXyslNufZ5ffaeCC3Ubq6N2mH3h2OeIMVFRKXCBE2cI8K9B-FbMkmgNxyhwIbU5v9D1Nxkaln7sYoz5yQyIwuD9tTsAJo717yIXKb9ttrYJUjxzfuvTlrQjRph0lx1VwopMaxOPXYQ17lnMhqS8skM-s8dvL4D0FOL7LpzRkBxl8n57KsHEWEP8i6zs_FbTgeguD3AGPtMWs988v5DJY1bdtqukn9jsATvseEVnYIbobFhSZSQIgnzE0Yx5M-kT3FZVkGZFxZmw5eqyJfZOzizWHLWfwFzudsyNt-indVJodweDfVTa5n_jwmHfgdG26ltPsDdEYlPM3pNPRYSfzBrgyaRKMeRnIISk-ZINLRymVqUNQFSdVpKhbiF6aSTdlVr6m4J5_D0_hbl0GR3Cqf_w7toJKzOrINMr-EUU1golRdmLJBS_0Q8sFqnv4--8iVoQ49BoBp_pE0URz7TXN7dhkOmV1w-uCjuAVQfOCfCsC0rd9w6zR9T8CnN4FZaScdjAc0ocWo9T99ccTn_MsbCAkdrM5l8MVkfsGZiQyei27Q9TDNC5t-LbOrW5CxY2E5-DcoiDqWraue9kntBqK4UJpF0bkDdAX51zn1AK6fM8PH24SYwFIG0j1OnnmnV4uvxsIx_jCEy4eecUNwqBhXX9CT6zlVceKEOZ3aYNRvVpPFKsv6md2oC8CRyozadGbpm2oMyeOPyrzpzTf5EGsSuKzd_pG2-MujCh2Y_oSLVgXQofUJGPFawf3MlwDLElpprCx4g.3; T=z=DHe4gBDvsBhBJ5WQ.BFiLe1MDc2NwZONTMzMTA0NzY-&sk=DAAgrgQRj8EzN7&ks=EAAqZmHnCK.IKk4f7enWfh67Q--~F&kt=EAAOECNp54eqJ0zvEjH2fjVRw--~E&ku=FAAMEQCIFyaEpqfKghk2vjh3.rvq6c5VEKxjL32n68gJUjUvoEWAiAjlF2qQ1uIsqPHuDRJE99fkgHE1Gt8le52gvsvWy.MSg--~B&d=dGlwAWI4RXRWQwFhAVFBRQFnAUdTWVdKR01VSjZTQ0xMTFZQWExRQVNJNTRZAXNsAU56QXhNQUU1TWpRME5qY3pNREUtAXNjAWF1YwF6egFESGU0Z0JBMko-; B=9bku5b1ge3obc&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=eq&i=b0Abz0kgt1ua329WN4Bf; YLS=v=2&p=1&n=1; A=9bku5b1ge3obc&t=1625416044&u=1625416131&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1vaGsvVOX5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUel+8fM6ODlowrMAqU4wOP/6/0; XB=9bku5b1ge3obc&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=eq&i=b0Abz0kgt1ua329WN4Bf; F=a=C56ta4AMvRgiSmlLUcABhOg68BoRvmqMCxhzT63J1SkGfr.PYB5C.cFDBglTNv6xLhPGXfQ-&b=8hLM`,
            };
            let keys = await ProductYahooService.getKeys(yahoo_account.cookie);
            let image = await ProductYahooService.uploadPhotoStep1(req.files.file.data, keys, yahoo_account.cookie);
            let thumb_path = await ProductYahooService.uploadPhotoStep2(image.url, keys, yahoo_account.cookie);
            return response.success200({ ...image, thumb_path: thumb_path });
        } catch (error) {
            console.log(error.response.data);
            return response.error500(error.response.data);
        }
    }

    static async get(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let products = await ProductYahooService.get(user._id);
            return response.success200({ products });
        } catch (error) {
            console.log(error);
            return response.error500(error);
        }
    }

    static async createProduct(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            let {
                folder_id,
                product_model,
                foreign_key,
                product_yahoo_title,
                yahoo_auction_category_id,
                start_price,
                bid_or_buy_price,
                import_price,
                status,
                status_comment,
                offer,
                quantity,
                duration,
                closing_time,
                retpolicy,
                retpolicy_comment,
                min_bid_rating,
                bad_rating_ratio,
                bid_credit_limit,
                auto_extension,
                close_early,
                num_resubmit,
                reserve_price,
                description,
                ship_time,
                shipping,
                location,
                city,
                ship_name1,
                ship_fee1,
                ship_name2,
                ship_fee2,
                ship_name3,
                ship_fee3,
                foreign_check,
                ship_schedule,
                featured_amount,
                bold,
                highlight,
                gift,
                wrapping,
                image_length,
            } = JSON.parse(req.body.payload);

            if (!folder_id || !product_yahoo_title || !yahoo_auction_category_id ||
                !description || !location || !import_price ) {
                return response.error400({message: '必須フィールドをすべて入力してください'})
            }

            let data = {
                user_id: user._id,
                images: [],
                folder_id,
                product_model,
                foreign_key,
                product_yahoo_title,
                yahoo_auction_category_id,
                start_price,
                bid_or_buy_price,
                import_price,
                status,
                status_comment,
                offer,
                quantity,
                duration,
                closing_time,
                retpolicy,
                retpolicy_comment,
                min_bid_rating,
                bad_rating_ratio,
                bid_credit_limit,
                auto_extension,
                close_early,
                num_resubmit,
                reserve_price,
                description,
                ship_time,
                shipping,
                location,
                city,
                ship_name1,
                ship_fee1,
                ship_name2,
                ship_fee2,
                ship_name3,
                ship_fee3,
                foreign_check,
                ship_schedule,
                featured_amount,
                bold,
                highlight,
                gift,
                wrapping,
            };
            if (req.files && image_length) {
                for (let index = 0; index < image_length; index++) {
                    const element = req.files[`image-` + index];
                    data.images.push(await UploadFile(element, { disk: 'yahoo-products/' + user._id + '/' }));
                }
            } else {
                return response.error400({ message: 'Image is required' });
            }

            let result = await ProductYahooService.create(data);

            // console.log(' ######################### result: ', result);
            // //Upload product
            // let yahooAccount = await AccountYahooService.findById('60ef00cd20e11f462010c643');
            // if (yahooAccount) {
            //     let proxyResult = await ProxyService.findByIdAndCheckLive(yahooAccount.proxy_id);
            //     if (proxyResult.status === 'SUCCESS') {
            //         let uploadAuction = await AuctionYahooService.uploadNewProduct(yahooAccount.cookie, result, proxyResult.data);
            //     } else {
            //         result.status = proxyResult.status;
            //         result.statusMessage = proxyResult.statusMessage;
            //     }
            //     await result.save();
            // }

            response.success200({ result });
        } catch (error) {
            console.log(error);
            console.log(error.response);

            response.error500(error);
        }
    }

    static async getDetailProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let result = await ProductYahooService.show(_id);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async updateProduct(req, res) {
        let response = new Response(res);
        try {
            let user = req.user;
            const { _id } = req.params;
            let {
                folder_id,
                images,
                product_model,
                foreign_key,
                product_yahoo_title,
                yahoo_auction_category_id,
                start_price,
                bid_or_buy_price,
                import_price,
                status,
                status_comment,
                offer,
                quantity,
                duration,
                closing_time,
                retpolicy,
                retpolicy_comment,
                min_bid_rating,
                bad_rating_ratio,
                bid_credit_limit,
                auto_extension,
                close_early,
                num_resubmit,
                reserve_price,
                description,
                ship_time,
                shipping,
                location,
                city,
                ship_name1,
                ship_fee1,
                ship_name2,
                ship_fee2,
                ship_name3,
                ship_fee3,
                foreign_check,
                ship_schedule,
                featured_amount,
                bold,
                highlight,
                gift,
                wrapping,
                image_length,
            } = JSON.parse(req.body.payload);

            if (!folder_id || !product_yahoo_title || !yahoo_auction_category_id ||
                !description || !location || !import_price ) {
                return response.error400({message: '必須フィールドをすべて入力してください'})
            }

            let data = {
                user_id: user._id,
                images,
                folder_id,
                product_model,
                foreign_key,
                product_yahoo_title,
                yahoo_auction_category_id,
                start_price,
                bid_or_buy_price,
                import_price,
                status,
                status_comment,
                offer,
                quantity,
                duration,
                closing_time,
                retpolicy,
                retpolicy_comment,
                min_bid_rating,
                bad_rating_ratio,
                bid_credit_limit,
                auto_extension,
                close_early,
                num_resubmit,
                reserve_price,
                description,
                ship_time,
                shipping,
                location,
                city,
                ship_name1,
                ship_fee1,
                ship_name2,
                ship_fee2,
                ship_name3,
                ship_fee3,
                foreign_check,
                ship_schedule,
                featured_amount,
                bold,
                highlight,
                gift,
                wrapping,
            };
            if (req.files && image_length) {
                for (let index = 0; index < image_length; index++) {
                    const element = req.files[`image-` + index];
                    if (element) {
                        data.images[index] = await UploadFile(element, { disk: 'yahoo-products/' + user._id + '/' });
                    }
                }
            }
            let result = await ProductYahooService.update(_id, data);
            // let uploadAuction = await AuctionYahooService.uploadNewProduct();

            response.success200({ result });
        } catch (error) {
            console.log(error);
            console.log(error.response);

            response.error500(error);
        }
    }

    static async deleteProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let result = await ProductYahooService.delete(_id);
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error);
        }
    }
}
