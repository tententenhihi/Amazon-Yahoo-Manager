import Response from '../utils/Response';
import ProductYahooService from '../services/ProductYahooService';
import FormData from 'form-data';
import axios from 'axios';

export default class ProductYahooController {
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

    static async getPhoto(req, res) {
        let response = new Response(res);
        try {
            let yahoo_account = {
                cookie: `XA=9bku5b1ge3obc&t=1625416044&u=1625416131&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1vaGsvVOX5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUel+8fM6ODlowrMAqU4wOP/6/0; XC=8TEBDn1OZxW7cUAnlLaDFBYSHLSm7SsymIeH0XtQ0wWmEFqTL2fZkZFjtlkA7C6ENFp9pjKziBlEsHwFJxXRQxgoW71SUnn6sQQR2BwqgeXwVjQQ2EOWUXbC8Xdtzj1DVg+xAfcb9tsSBHfWfcM8KeL1c7bQs9q6fq9J3eEPbeZqd1I7cQIAT9scjvLG/MTf+q1VujCP8KK+34dZZO+2YJ9vnSo5RXYOFn5z7nrlP406B70S1lqqHxtLQAmFRQKwxhVIb76RJiYfB+fO6M8FGBXfOqqmv1Q6i7WJRdDtMbJDrjHfkAEDR6bEH7eUc4gRCCLqyAUznEB3DcTtPY6ZvGGbYK+VxGq+Pc5bxdsB6uQaAjOxSl2Y5ROMC+PJfvLeRZhCxHekfWjUcnBBJZ1COSRWR6ZDLcFAmaTzqSEMY13HwckHF3Xn6giFMkzkB1izhxomV1LrfyIWN0AhJ04YYOHIn+8v1qgHN/uu8huFAO1lUSZCNCNSDQdyi9hHI9tqJXEJgaHRUeGX6KbF2gQervizp+y3eVZNJ00Nak/5yRt7bPcAdG/QXHNJ7BUEnL6F+ywBhb+uipUsaF53T4bj1w==.1; SSL=v=1&s=BNl3PbVChVjSljAPzazmwf86LiQVs8WQPs4YuPrCEAT_vBST8CuD0XBwoMvbIDGjxkuaHa7cDpoYgQZqaO3WFg--&kv=0; Y=v=1&n=50l0olb9bec3l&l=4n55axsvxv/o&p=m2mvvjp012000000&ig=00b2j&r=18k&lg=ja-JP&intl=jp; _n=cGqXa8MFQs3ITa7NVfN3SI_uPNOsj-OkAAq89Sw8WzB3djlqQuW7m01ihhrp0XJOSxSgcDgmjTQ_1ZUbaBathsGG7UMoagatmC-tZPJ1JEZ69Qi_rw3YjOhoVhbAiEx9zpm-nESRk6hsQl1O8yQcjRuoOUsdnxq9uwc9B-WaaZNpWo7Htxy1Qm8_DrFTFNBiNcq8HhkMN1WtfKrG5f_RKk2QuICeUsW_iMhQTzDcQGzCFoyzaFvVAjktle7eDO627yWYV3srPH2YczPNZnJIGYlHxZAF9V-Tk-AIS1L69xFC52WVa-mP2yJ1zO03SZ37x_J8u9yKL_N7idhomko7sPoBr99_KLUCcGZx56Sd8GnjzJVjRQJcGxgeOn1-0OG3CIQ0VgUzbqIP8wljffkslLh236oh7rGx3rsOTDXyslNufZ5ffaeCC3Ubq6N2mH3h2OeIMVFRKXCBE2cI8K9B-FbMkmgNxyhwIbU5v9D1Nxkaln7sYoz5yQyIwuD9tTsAJo717yIXKb9ttrYJUjxzfuvTlrQjRph0lx1VwopMaxOPXYQ17lnMhqS8skM-s8dvL4D0FOL7LpzRkBxl8n57KsHEWEP8i6zs_FbTgeguD3AGPtMWs988v5DJY1bdtqukn9jsATvseEVnYIbobFhSZSQIgnzE0Yx5M-kT3FZVkGZFxZmw5eqyJfZOzizWHLWfwFzudsyNt-indVJodweDfVTa5n_jwmHfgdG26ltPsDdEYlPM3pNPRYSfzBrgyaRKMeRnIISk-ZINLRymVqUNQFSdVpKhbiF6aSTdlVr6m4J5_D0_hbl0GR3Cqf_w7toJKzOrINMr-EUU1golRdmLJBS_0Q8sFqnv4--8iVoQ49BoBp_pE0URz7TXN7dhkOmV1w-uCjuAVQfOCfCsC0rd9w6zR9T8CnN4FZaScdjAc0ocWo9T99ccTn_MsbCAkdrM5l8MVkfsGZiQyei27Q9TDNC5t-LbOrW5CxY2E5-DcoiDqWraue9kntBqK4UJpF0bkDdAX51zn1AK6fM8PH24SYwFIG0j1OnnmnV4uvxsIx_jCEy4eecUNwqBhXX9CT6zlVceKEOZ3aYNRvVpPFKsv6md2oC8CRyozadGbpm2oMyeOPyrzpzTf5EGsSuKzd_pG2-MujCh2Y_oSLVgXQofUJGPFawf3MlwDLElpprCx4g.3; T=z=DHe4gBDvsBhBJ5WQ.BFiLe1MDc2NwZONTMzMTA0NzY-&sk=DAAgrgQRj8EzN7&ks=EAAqZmHnCK.IKk4f7enWfh67Q--~F&kt=EAAOECNp54eqJ0zvEjH2fjVRw--~E&ku=FAAMEQCIFyaEpqfKghk2vjh3.rvq6c5VEKxjL32n68gJUjUvoEWAiAjlF2qQ1uIsqPHuDRJE99fkgHE1Gt8le52gvsvWy.MSg--~B&d=dGlwAWI4RXRWQwFhAVFBRQFnAUdTWVdKR01VSjZTQ0xMTFZQWExRQVNJNTRZAXNsAU56QXhNQUU1TWpRME5qY3pNREUtAXNjAWF1YwF6egFESGU0Z0JBMko-; B=9bku5b1ge3obc&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=eq&i=b0Abz0kgt1ua329WN4Bf; YLS=v=2&p=1&n=1; A=9bku5b1ge3obc&t=1625416044&u=1625416131&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1vaGsvVOX5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUel+8fM6ODlowrMAqU4wOP/6/0; XB=9bku5b1ge3obc&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=eq&i=b0Abz0kgt1ua329WN4Bf; F=a=C56ta4AMvRgiSmlLUcABhOg68BoRvmqMCxhzT63J1SkGfr.PYB5C.cFDBglTNv6xLhPGXfQ-&b=8hLM`
            }
            let keys = await ProductYahooService.getKeys(yahoo_account.cookie)
            let image = await ProductYahooService.uploadPhotoStep1(req.files.file.data, keys, yahoo_account.cookie)
            let thumb_path = await ProductYahooService.uploadPhotoStep2(image.url, keys, yahoo_account.cookie)
            return response.success200({ ...image, thumb_path: thumb_path });
        } catch (error) {
            console.log(error.response.data);
            return response.error500(error.response.data);
        }
    }

    static async createProduct (req, res) {
        let response = new Response(res);
        try {
            // let { product_status, product_status_des, price_cut_negotiations, quantity, holding_period,
            //     ending_time, returnAbility, remarks_for_returns, bid_limit, automatic_extension, early_termination,
            //     auto_relisting, paid_type,  shipping_cost, prefecture, address, shipping_method_1, shipping_rate_1,
            //     shipping_method_2, shipping_rate_2, shipping_method_3, shipping_rate_3, overseas_shipping,
            //     ship_schedule, featured_auction, bold_text, bg_color, conspicuous_icon, gift_icon } = req.body

            let yahoo_account = {
                cookie: `XA=9bku5b1ge3obc&t=1625416044&u=1625416131&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1vaGsvVOX5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUel+8fM6ODlowrMAqU4wOP/6/0; XC=8TEBDn1OZxW7cUAnlLaDFBYSHLSm7SsymIeH0XtQ0wWmEFqTL2fZkZFjtlkA7C6ENFp9pjKziBlEsHwFJxXRQxgoW71SUnn6sQQR2BwqgeXwVjQQ2EOWUXbC8Xdtzj1DVg+xAfcb9tsSBHfWfcM8KeL1c7bQs9q6fq9J3eEPbeZqd1I7cQIAT9scjvLG/MTf+q1VujCP8KK+34dZZO+2YJ9vnSo5RXYOFn5z7nrlP406B70S1lqqHxtLQAmFRQKwxhVIb76RJiYfB+fO6M8FGBXfOqqmv1Q6i7WJRdDtMbJDrjHfkAEDR6bEH7eUc4gRCCLqyAUznEB3DcTtPY6ZvGGbYK+VxGq+Pc5bxdsB6uQaAjOxSl2Y5ROMC+PJfvLeRZhCxHekfWjUcnBBJZ1COSRWR6ZDLcFAmaTzqSEMY13HwckHF3Xn6giFMkzkB1izhxomV1LrfyIWN0AhJ04YYOHIn+8v1qgHN/uu8huFAO1lUSZCNCNSDQdyi9hHI9tqJXEJgaHRUeGX6KbF2gQervizp+y3eVZNJ00Nak/5yRt7bPcAdG/QXHNJ7BUEnL6F+ywBhb+uipUsaF53T4bj1w==.1; SSL=v=1&s=BNl3PbVChVjSljAPzazmwf86LiQVs8WQPs4YuPrCEAT_vBST8CuD0XBwoMvbIDGjxkuaHa7cDpoYgQZqaO3WFg--&kv=0; Y=v=1&n=50l0olb9bec3l&l=4n55axsvxv/o&p=m2mvvjp012000000&ig=00b2j&r=18k&lg=ja-JP&intl=jp; _n=cGqXa8MFQs3ITa7NVfN3SI_uPNOsj-OkAAq89Sw8WzB3djlqQuW7m01ihhrp0XJOSxSgcDgmjTQ_1ZUbaBathsGG7UMoagatmC-tZPJ1JEZ69Qi_rw3YjOhoVhbAiEx9zpm-nESRk6hsQl1O8yQcjRuoOUsdnxq9uwc9B-WaaZNpWo7Htxy1Qm8_DrFTFNBiNcq8HhkMN1WtfKrG5f_RKk2QuICeUsW_iMhQTzDcQGzCFoyzaFvVAjktle7eDO627yWYV3srPH2YczPNZnJIGYlHxZAF9V-Tk-AIS1L69xFC52WVa-mP2yJ1zO03SZ37x_J8u9yKL_N7idhomko7sPoBr99_KLUCcGZx56Sd8GnjzJVjRQJcGxgeOn1-0OG3CIQ0VgUzbqIP8wljffkslLh236oh7rGx3rsOTDXyslNufZ5ffaeCC3Ubq6N2mH3h2OeIMVFRKXCBE2cI8K9B-FbMkmgNxyhwIbU5v9D1Nxkaln7sYoz5yQyIwuD9tTsAJo717yIXKb9ttrYJUjxzfuvTlrQjRph0lx1VwopMaxOPXYQ17lnMhqS8skM-s8dvL4D0FOL7LpzRkBxl8n57KsHEWEP8i6zs_FbTgeguD3AGPtMWs988v5DJY1bdtqukn9jsATvseEVnYIbobFhSZSQIgnzE0Yx5M-kT3FZVkGZFxZmw5eqyJfZOzizWHLWfwFzudsyNt-indVJodweDfVTa5n_jwmHfgdG26ltPsDdEYlPM3pNPRYSfzBrgyaRKMeRnIISk-ZINLRymVqUNQFSdVpKhbiF6aSTdlVr6m4J5_D0_hbl0GR3Cqf_w7toJKzOrINMr-EUU1golRdmLJBS_0Q8sFqnv4--8iVoQ49BoBp_pE0URz7TXN7dhkOmV1w-uCjuAVQfOCfCsC0rd9w6zR9T8CnN4FZaScdjAc0ocWo9T99ccTn_MsbCAkdrM5l8MVkfsGZiQyei27Q9TDNC5t-LbOrW5CxY2E5-DcoiDqWraue9kntBqK4UJpF0bkDdAX51zn1AK6fM8PH24SYwFIG0j1OnnmnV4uvxsIx_jCEy4eecUNwqBhXX9CT6zlVceKEOZ3aYNRvVpPFKsv6md2oC8CRyozadGbpm2oMyeOPyrzpzTf5EGsSuKzd_pG2-MujCh2Y_oSLVgXQofUJGPFawf3MlwDLElpprCx4g.3; T=z=DHe4gBDvsBhBJ5WQ.BFiLe1MDc2NwZONTMzMTA0NzY-&sk=DAAgrgQRj8EzN7&ks=EAAqZmHnCK.IKk4f7enWfh67Q--~F&kt=EAAOECNp54eqJ0zvEjH2fjVRw--~E&ku=FAAMEQCIFyaEpqfKghk2vjh3.rvq6c5VEKxjL32n68gJUjUvoEWAiAjlF2qQ1uIsqPHuDRJE99fkgHE1Gt8le52gvsvWy.MSg--~B&d=dGlwAWI4RXRWQwFhAVFBRQFnAUdTWVdKR01VSjZTQ0xMTFZQWExRQVNJNTRZAXNsAU56QXhNQUU1TWpRME5qY3pNREUtAXNjAWF1YwF6egFESGU0Z0JBMko-; B=9bku5b1ge3obc&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=eq&i=b0Abz0kgt1ua329WN4Bf; YLS=v=2&p=1&n=1; A=9bku5b1ge3obc&t=1625416044&u=1625416131&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1vaGsvVOX5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUel+8fM6ODlowrMAqU4wOP/6/0; XB=9bku5b1ge3obc&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=eq&i=b0Abz0kgt1ua329WN4Bf; F=a=C56ta4AMvRgiSmlLUcABhOg68BoRvmqMCxhzT63J1SkGfr.PYB5C.cFDBglTNv6xLhPGXfQ-&b=8hLM`
            }
            let keys = await ProductYahooService.getKeys(yahoo_account.cookie)

            let previewParams = {
                aID: '',
                oldAID: '',
                mode: 'submit',
                category: 22288,
                md5: keys.md5,
                '.crumb': keys.crumb,
                tos: 'yes',
                submitTipsDisp: 0,
                fnavi: 1,
                CloseEarly: 'yes',
                pagetype: 'form',
                isDraftChecked: '',
                saveIndex: 0,
                newsubmitform: 1,
                retpolicy_comment: '',
                info01: -420,
                info02: 2,
                info03: 'Chrome PDF Plugin|Chrome PDF Viewer',
                draftIndex: '',
                thumbNail: '',
                image_comment1: '',
                ImageFullPath1: '',
                ImageWidth1: '',
                ImageHeight1: '',
                image_comment2: '',
                ImageFullPath2: '',
                ImageWidth2: '',
                ImageHeight2: '',
                image_comment3: '',
                ImageFullPath3: '',
                ImageWidth3: '',
                ImageHeight3: '',
                image_comment4: '',
                ImageFullPath4: '',
                ImageWidth4: '',
                ImageHeight4: '',
                image_comment5: '',
                ImageFullPath5: '',
                ImageWidth5: '',
                ImageHeight5: '',
                image_comment6: '',
                ImageFullPath6: '',
                ImageWidth6: '',
                ImageHeight6: '',
                image_comment7: '',
                ImageFullPath7: '',
                ImageWidth7: '',
                ImageHeight7: '',
                image_comment8: '',
                ImageFullPath8: '',
                ImageWidth8: '',
                ImageHeight8: '',
                image_comment9: '',
                ImageFullPath9: '',
                ImageWidth9: '',
                ImageHeight9: '',
                image_comment10: '',
                ImageFullPath10: '',
                ImageWidth10: '',
                ImageHeight10: '',
                auction_server: 'https://auctions.yahoo.co.jp/sell/jp',
                uploadserver: 'sell.auctions.yahoo.co.jp',
                ImageCntMax: 10,
                ypoint: 0,
                encode: 'utf-8',
                Title: 'name2253453',
                brand_line_id: '',
                brand_line_id: '',
                brand_line_id: '',
                item_segment_id: '',
                item_spec_size_id: '',
                item_spec_size_type: '',
                istatus: 'used10',
                submit_description: 'html',
                Description: 'content225456',
                Description_rte: 'content',
                Description_rte_work: '',
                Description_plain_work: '',
                Description_plain: '',
                Quantity: 1,
                dskPayment: 'ypmOK',
                shiptime: 'payment',
                loc_cd: 11,
                shipping: 'seller',
                shippinginput: 'now',
                is_yahuneko_nekoposu_ship: 'yes',
                is_yahuneko_taqbin_compact_ship: '',
                is_yahuneko_taqbin_ship: 'yes',
                is_jp_yupacket_official_ship: 'yes',
                is_jp_yupack_official_ship: '',
                is_other_ship: '',
                itemsize: '',
                itemweight: '',
                shipschedule: 2,
                salesmode: 'auction',
                StartPrice: 5000,
                BidOrBuyPrice: '',
                submitUnixtime: 1625529311,
                Duration: 3,
                tmpClosingYMD: '2021-07-09',
                tmpClosingTime: '',
                ClosingYMD: '2021-07-09',
                ClosingTime: 8,
                numResubmit: 3,
                markdown_ratio: 0,
                featuredRadio: '',
                featuredAmount: '',
                oldCpaAmount: '',
                cpaAmount: 50,
                AutoExtension: 'yes',
                minBidRating: 0,
                badRatingRatio: 'yes',
                retpolicy: 0,
                promoteCtoOfficial_shipMethod: 'クリックポスト',
                shippingSize: 60,
                promoteTAQBINtoOfficial_shipMethod: '現在の配送方法',
                promoteYumailtoOfficial_shipMethod: 'ゆうメール',
                promoteNon_STANDARDtoOfficial_shipMethod: '定形外郵便'
            }
            let submitParams = await ProductYahooService.previewBeforeSubmit(previewParams, yahoo_account.cookie)
            let result = await ProductYahooService.confirmSubmit(submitParams, yahoo_account.cookie)
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error)
        }
    }

    static async updateProduct (req, res) {
        let response = new Response(res);
        try {
            const {_id} = req.params;
            let { product_status, product_status_des, price_cut_negotiations, quantity, holding_period, ending_time,
                returnAbility, remarks_for_returns, bid_limit, automatic_extension, early_termination, auto_relisting,
                paid_type, shipping_cost, prefecture, address, shipping_method_1, shipping_rate_1, shipping_method_2,
                shipping_rate_2, shipping_method_3, shipping_rate_3, overseas_shipping, ship_schedule,
                featured_auction, bold_text, bg_color, conspicuous_icon, gift_icon } = req.body
            let user = req.user

            // if (!product_status || !price_cut_negotiations || !quantity || !holding_period || !ending_time || !returnAbility ||
            //     !auto_relisting || !paid_type ||  !shipping_cost || !prefecture || !address || !ship_schedule) {
            //     response.error400({ message: 'Please input all required fields'})
            // }

            let data = {
                user_id: user._id,
                product_status,
                product_status_des,
                price_cut_negotiations,
                quantity,
                holding_period,
                ending_time,
                returnAbility,
                remarks_for_returns,
                bid_limit,
                automatic_extension,
                early_termination,
                auto_relisting,
                paid_type,
                shipping_cost,
                prefecture,
                address,
                shipping_method_1,
                shipping_rate_1,
                shipping_method_2,
                shipping_rate_2,
                shipping_method_3,
                shipping_rate_3,
                overseas_shipping,
                ship_schedule,
                featured_auction,
                bold_text,
                bg_color,
                conspicuous_icon,
                gift_icon
            }

            let result = await ProductYahooService.update(_id, data);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error)
        }
    }

    static async getDetailProduct (req, res) {
        let response = new Response(res);
        try {
            const {_id} = req.params;
            console.log(_id)
        let result = await ProductYahooService.show(_id);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error)
        }
    }
    
    static async deleteProduct (req, res) {
        let response = new Response(res);
        try {
            const {_id} = req.params;
            let result = await ProductYahooService.delete(_id);
            if (result) {
                response.success200({ success: true });
            }
        } catch (error) {
            response.error500(error)
        }
    }
}
