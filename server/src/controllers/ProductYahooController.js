import Response from '../utils/Response';
import ProductYahooService from '../services/ProductYahooService';
import FormData from 'form-data';
import axios from 'axios';
import Qs from 'query-string';
import Fs from 'fs';

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

    static async createProduct(req, res) {
        let response = new Response(res);
        try {
            let cookie = `YLS=v=2&p=1&n=1; F=a=O7WTlr4MvRgadh4VTKkKXmxV4vn..wnQoX_s9o8vA0QIfnXYdyT8Px0NaC6KLCtK189I2NI-&b=qFZt; B=fmar8a5gd39kn&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=pq&i=JeqNXgF.p9kee8Cu84w0; XB=fmar8a5gd39kn&b=4&d=eeLwEr1pYF3pMtOb2h_RCIIT2tfG9O7CyWzsxjH8&s=pq&i=JeqNXgF.p9kee8Cu84w0; Y=v=1&n=50l0olb9bec3l&l=4n55axsvxv/o&p=m2mvvjp012000000&ig=00b2j&r=18k&lg=ja-JP&intl=jp; T=z=o0S3gBochAhBIRkBW8DxLhVMDc2NwZONTMzMTA0NzY-&sk=DAAV4Z3gRjvI3m&ks=EAAPbZHaZUMEKEQFKoGpiquow--~F&kt=EAA7fNwChNSjnV1qj8F9akb6g--~E&ku=FAAMEUCIFs67FZAYrDcaWHJxVGW6pWbcyq34oepI4x0Ou5LZoKXAiEAjxZQ9w4gEHGNqz0IxM1piq.6KlYqa7GInOrlkjP319w-~B&d=dGlwAXJxTzVEQQFhAVFBRQFnAUdTWVdKR01VSjZTQ0xMTFZQWExRQVNJNTRZAXNsAU56QXhNQUU1TWpRME5qY3pNREUtAXNjAWF1YwF6egFvMFMzZ0JBMko-; SSL=v=1&s=K2AbBlwbnk_2.4ZvdfiHAKPh2fmTRvD1CWQRId_muoqPAckvu0wHKOZfDSe5v7qwEEdJTUGpDwV6HQ._k4VMJA--&kv=0; _n=cGqXa8MFQs3ITa7NVfN3SI_uPNOsj-OkAAq89Sw8WzB3djlqQuW7m01ihhrp0XJOSxSgcDgmjTQ_1ZUbaBathnQVoj7rx1a0zANXuwDZ_E_frmCnIXz0x2jnFZJLzfUvgFM_XP67HR14U0XW6_JyODD4FGwFOsfaSajCsJAdYLrVG39v0DkSJgICmkvQAh5KD-AQ8Ct21wFAsw_ld9lqbmNHNa6KSyxjZX80ijk8bPDr8bNxfKlC_0dYkPhWhaabKPj_cOShs2NU6HYQp8sOKMYJbiT4_b4_AeDLqpPkL1YX0xFevASgF-5sAo07FCSrDT5LuAWz48c_hBGF6I2YkcHIcOw2Re7ft0U-I7ShtXPg77mwFbOBF0LWtVnYsUve8tIGZufawG2jZr8cPMvgNmPTsvbw87XOnk5T9urGg947GoZ8_xS2tYV-p0D6U0ktJhUBZcTDfscSz130i5SYW4MXOJRj30gv88q_4e8n8MBnvUHUBLUcrJTzPgxGQcNPvgWDEMyuL4qECO96r_vahQurYHyqpcY03QQqhXZkvkQbvpCcZe4zKlOEyLEl5rwYiBo6EZHV7_QtqmTsyeONAWLWaUHjTY7PEbP0rsyJBpqQsidvfGA9v1xQulN_FbbDwXA5_SqgVnhS669gMk4KZQG4yQPUqVgvDsCnNqG-kgiHI1uXgE6vPRaDzdUqz3fz3BBh_pVpaVQNHRH5US2dy05moGrut8L5GDdeNDDe8ijS14u9zLQX2w3hx0DHaeCBrOxI8hKKp_2YojARJTu4KVgEhcrbRfpd3P3J9_L5yDIqP6mOAbHXkwlVm4nclTrNeQ9v1DrU9lk25v_PQL8iG_-GGy9qWbW-Eql_tkLP9v0le3iPiyQ3DuwbZojS8bne1srsIs1oxnKoxNm408hrIy5s26qr6hQAbl7g626I7LcmQEG0ZE4_lRW2XK6vpl5cdnX_3bHfjiY_FQEAR3Kp63YOCtLMFm4q1nNtTnagcd2EMOhvpSKTlJy0hRwdIzc9glMFepwdqYLz6EU3S7yLrpMKRqFKc8lBCCgEVDIbkElVuGe-mRpNSQWHyTP64CA8w5QKPjhWNkD5pMizqM6YK5wI7pL-SAP0t7h1X1Hi3kq0rtftQvhlYEb8UsRlRt4nKEusu1hrVtEDA1RQ4QhCBYyCbZQ2GEDR9zx7v7FiyNU.3; XC=8TEBDn1OZxW7cUAnlLaDFBYSHLSm7SsymIeH0XtQ0wWmEFqTL2fZkZFjtlkA7C6ENFp9pjKziBlEsHwFJxXRQxgoW71SUnn6sQQR2BwqgeWY1k2posgYa0lahA32apZyf2NlbmE/nO4vE1n0jIP4MQDTCMYzvBo503uRnRcldHctdZC5CNCRNJSTIUCaAQRMZSJgKmb2pRPnsuAszs7tW8wYXCOWcjkyof5zAVsRqWMEzvPDS+FFUQW7wrTI6/dNs9glboawdo2J5ITGABKSbAm/6FoW3DHq0VKUxDxbcDMl4XeGpPTVREIkftodW+04pVpAdYzyPblhfxxCperzsvEZBKWnEeGbFgDeXc7s6BED/gKV2vVrRjii30cEckNSqsA2c8PvATw0C9p5LJYD3UECpYgsCrbHzYFEIbsZzGQb60HekYle3Rvb9w/6b9AgdnJv76ZHEqXZB6L+0BynnyvcPY/zF/tPo6nSlP6Ctg/VtNva2K+ZSaNLAfRbWjiO1960ao0ArQzuRYbZueYBTMlnhwmJDcKcsJiAIVloMHI6vOmUan32qUHpusVOc3/e0o7atc7LexRerQ0+dbymAA==.1; A=fmar8a5gd39kn&t=1624352407&u=1625107752&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1qaWopUub5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUelUK3kZ7yqrnH4UsGZeZWq+/0; XA=fmar8a5gd39kn&t=1624352407&u=1625107752&sd=B&v=1&d=C08MKWPROjfMK9xZ+1xceWMZxgNHPfKJGf9PUWFO5J+rUa+MXMJ9rXrr8PZ7ozAg8sEKh5k9vlc8uiIDVoYEZsiO8MyhWQ1qaWopUub5feqoy+iUK3T17zXsWN0wx8zJ6Ie9FW8Ho0FYyaxAeJHadK4hg2SFUelUK3kZ7yqrnH4UsGZeZWq+/0; irepNoBidExp=1; irepNoWonExp=1; irepIsLogin=1; irepLastBidTime=2; irepLastWonTime=2`;
            let listImage = ['data/images/download.jpg', 'data/images/hình-ảnh-phong-cảnh-đẹp-1024x680.jpg', 'data/images/unnamed.jpg'];
            let headers = {
                cookie,
                'user-agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
                origin: 'https://auctions.yahoo.co.jp',
                authority: 'auctions.yahoo.co.jp',
                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
            };

            let keys = await ProductYahooService.getKeys(cookie);
            // Upload Image and get thumbnail
            let payloadImage = {};
            for (let i = 0; i < listImage.length; i++) {
                const formData = new FormData();
                const buffer = Fs.readFileSync(listImage[i]);
                formData.append('files[0]', buffer, 'photo.jpg');
                formData.append('.crumb', keys.img_crumb);
                const resImage = await axios.post(`https://auctions.yahoo.co.jp/img/images/new`, formData, {
                    headers: {
                        ...headers,
                        ...formData.getHeaders(),
                    },
                });

                payloadImage[`image_comment${i + 1}`] = '';
                payloadImage[`ImageFullPath${i + 1}`] = resImage.data.images[0].url;
                payloadImage[`ImageWidth${i + 1}`] = resImage.data.images[0].width;
                payloadImage[`ImageHeight${i + 1}`] = resImage.data.images[0].height;

                // Set Thumbnail is first image
                if (i === 0) {
                    let urlImage = resImage.data.images[0].url;
                    const form = new FormData();
                    form.append('path', urlImage);
                    form.append('.crumb', keys.img_crumb);

                    const configs = {
                        headers: {
                            ...form.getHeaders(),
                            cookie: cookie,
                        },
                    };
                    const resThumbnail = await axios.post('https://auctions.yahoo.co.jp/img/images/new', form, configs);
                    payloadImage = { ...payloadImage, thumbNail: resThumbnail.data.thumbnail };
                }
            }

            // PREVIEW
            let previewParams = {
                aID: '',
                oldAID: '',
                mode: 'submit',
                category: 2084316144,
                md5: keys.md5,
                '.crumb': keys.crumb,
                tos: 'yes',
                submitTipsDisp: 0,
                fnavi: 1,
                CloseEarly: 'yes',
                pagetype: 'form',
                saveIndex: 0,
                newsubmitform: 1,
                info01: -420,
                info02: 3,
                info03: 'Chrome PDF Plugin|Chrome PDF Viewer|Native Client',
                ...payloadImage,
                auction_server: 'https://auctions.yahoo.co.jp/sell/jp',
                uploadserver: 'sell.auctions.yahoo.co.jp',
                ImageCntMax: 10,
                ypoint: 0,
                encode: 'utf-8',
                Title: 'Yu-Gi-Oh! PAC1-JP010 Kuribo PRISMATIC 19999999999999999999',
                brand_line_id: '100789',
                istatus: 'new',
                submit_description: 'html',
                Description:
                    '<h1 id="title" class="a-size-large a-spacing-none" style="box-sizing: border-box; padding: 0px; margin-top: 0px; margin-right: 0px; margin-left: 0px; font-weight: 400; color: #0f1111; font-family: &quot;Hiragino Kaku Gothic ProN&quot;, &quot;Hiragino Sans&quot;, Meiryo, sans-serif; background-color: #ffffff; margin-bottom: 0px !important; font-size: 24px !important; line-height: 32px !important;"><ul class="a-unordered-list a-nostyle a-vertical a-spacing-none detail-bullet-list" style="box-sizing: border-box; margin: 0px 0px 1px 18px; padding: 0px; font-size: 14px;"><li style="box-sizing: border-box; list-style: none; overflow-wrap: break-word; margin: 0px 0px 5.5px;"><span class="a-list-item" style="box-sizing: border-box;"><span class="a-text-bold" style="box-sizing: border-box; font-weight: 700 !important;">Package Dimensions ‏ : ‎&nbsp;</span><span style="box-sizing: border-box;">9.2 x 6.6 x 0.4 cm; 10 g</span></span></li><li style="box-sizing: border-box; list-style: none; overflow-wrap: break-word; margin: 0px 0px 5.5px;"><span class="a-list-item" style="box-sizing: border-box;"><span class="a-text-bold" style="box-sizing: border-box; font-weight: 700 !important;">Date First Available ‏ : ‎&nbsp;</span><span style="box-sizing: border-box;">February 20, 2019</span></span></li><li style="box-sizing: border-box; list-style: none; overflow-wrap: break-word; margin: 0px 0px 5.5px;"><span class="a-list-item" style="box-sizing: border-box;"><span class="a-text-bold" style="box-sizing: border-box; font-weight: 700 !important;">Manufacturer ‏ : ‎&nbsp;</span><span style="box-sizing: border-box;">コナミデジタルエンタテインメント</span></span></li><li style="box-sizing: border-box; list-style: none; overflow-wrap: break-word; margin: 0px 0px 5.5px;"><span class="a-list-item" style="box-sizing: border-box;"><span class="a-text-bold" style="box-sizing: border-box; font-weight: 700 !important;">ASIN ‏ : ‎&nbsp;</span><span style="box-sizing: border-box;">B07P334TJF</span></span></li><li style="box-sizing: border-box; list-style: none; overflow-wrap: break-word; margin: 0px 0px 5.5px;"><span class="a-list-item" style="box-sizing: border-box;"><span class="a-text-bold" style="box-sizing: border-box; font-weight: 700 !important;">Manufacturer reference ‏ : ‎&nbsp;</span><span style="box-sizing: border-box;">VJMP-JP159UR</span></span></li></ul></h1>',
                Description_rte:
                    '<h1 id=%22title%22 class=%22a-size-large a-spacing-none%22 style=%22box-sizing: border-box; padding: 0px; margin-top: 0px; margin-right: 0px; margin-left: 0px; font-weight: 400; color: #0f1111; font-family: %26quot;Hiragino Kaku Gothic ProN%26quot;, %26quot;Hiragino Sans%26quot;, Meiryo, sans-serif; background-color: #ffffff; margin-bottom: 0px !important; font-size: 24px !important; line-height: 32px !important;%22><ul class=%22a-unordered-list a-nostyle a-vertical a-spacing-none detail-bullet-list%22 style=%22box-sizing: border-box; margin: 0px 0px 1px 18px; padding: 0px; font-size: 14px;%22><li style=%22box-sizing: border-box; list-style: none; overflow-wrap: break-word; margin: 0px 0px 5.5px;%22><span class=%22a-list-item%22 style=%22box-sizing: border-box;%22><span class=%22a-text-bold%22 style=%22box-sizing: border-box; font-weight: 700 !important;%22>Package Dimensions ‏ : ‎%26nbsp;</span><span style=%22box-sizing: border-box;%22>9.2 x 6.6 x 0.4 cm; 10 g</span></span></li><li style=%22box-sizing: border-box; list-style: none; overflow-wrap: break-word; margin: 0px 0px 5.5px;%22><span class=%22a-list-item%22 style=%22box-sizing: border-box;%22><span class=%22a-text-bold%22 style=%22box-sizing: border-box; font-weight: 700 !important;%22>Date First Available ‏ : ‎%26nbsp;</span><span style=%22box-sizing: border-box;%22>February 20, 2019</span></span></li><li style=%22box-sizing: border-box; list-style: none; overflow-wrap: break-word; margin: 0px 0px 5.5px;%22><span class=%22a-list-item%22 style=%22box-sizing: border-box;%22><span class=%22a-text-bold%22 style=%22box-sizing: border-box; font-weight: 700 !important;%22>Manufacturer ‏ : ‎%26nbsp;</span><span style=%22box-sizing: border-box;%22>コナミデジタルエンタテインメント</span></span></li><li style=%22box-sizing: border-box; list-style: none; overflow-wrap: break-word; margin: 0px 0px 5.5px;%22><span class=%22a-list-item%22 style=%22box-sizing: border-box;%22><span class=%22a-text-bold%22 style=%22box-sizing: border-box; font-weight: 700 !important;%22>ASIN ‏ : ‎%26nbsp;</span><span style=%22box-sizing: border-box;%22>B07P334TJF</span></span></li><li style=%22box-sizing: border-box; list-style: none; overflow-wrap: break-word; margin: 0px 0px 5.5px;%22><span class=%22a-list-item%22 style=%22box-sizing: border-box;%22><span class=%22a-text-bold%22 style=%22box-sizing: border-box; font-weight: 700 !important;%22>Manufacturer reference ‏ : ‎%26nbsp;</span><span style=%22box-sizing: border-box;%22>VJMP-JP159UR</span></span></li></ul></h1>',
                Quantity: 1,
                dskPayment: 'ypmOK',
                shiptime: 'payment',
                loc_cd: 11,
                shipping: 'seller',
                shippinginput: 'now',
                is_yahuneko_nekoposu_ship: 'yes',
                is_yahuneko_taqbin_ship: 'yes',
                is_jp_yupacket_official_ship: 'yes',
                shipschedule: 2,
                salesmode: 'auction',
                StartPrice: 154232,
                BidOrBuyPrice: '',
                submitUnixtime: Date.now(),
                Duration: 3,
                tmpClosingYMD: '2021-07-07',
                ClosingYMD: '2021-07-07',
                ClosingTime: 18,
                numResubmit: 3,
                markdown_ratio: 0,
                // cpaAmount: 0,
                AutoExtension: 'yes',
                minBidRating: 0,
                badRatingRatio: 'yes',
                retpolicy: 0,
                promoteCtoOfficial_shipMethod: 'クリックポスト',
                shippingSize: 60,
                promoteTAQBINtoOfficial_shipMethod: '現在の配送方法',
                promoteYumailtoOfficial_shipMethod: 'ゆうメール',
                promoteNon_STANDARDtoOfficial_shipMethod: '定形外郵便',
            };
            let payload = Qs.stringify(previewParams);
            headers = {
                ...headers,
                referer: 'https://auctions.yahoo.co.jp/sell/jp/show/submit',
                'Content-Type': 'application/x-www-form-urlencoded',
            };
            let resPreview = await axios.post(`https://auctions.yahoo.co.jp/sell/jp/show/preview`, payload, {
                headers,
            });

            let mgc = /<input type="hidden" name="mgc" value="(.*)">/.exec(resPreview.data);
            if (mgc) mgc = mgc[1];

            // SUBMIT
            previewParams = {
                ...previewParams,
                comefrprv: 1,
                catalog_no_applicable: 0,
                // markdown_ratio: '',
                ypmOK: 1,
                browserAcceptLanguage: 'en-us',
                ipCountryCode: 'ot',
                shipname1: '',
                shipfee1: '',
                hokkaidoshipping1: '',
                okinawashipping1: '',
                isolatedislandshipping1: '',
                longdistshipping1: '',
                shipname2: '',
                shipfee2: '',
                hokkaidoshipping2: '',
                okinawashipping2: '',
                isolatedislandshipping2: '',
                longdistshipping2: '',
                shipname3: '',
                shipfee3: '',
                hokkaidoshipping3: '',
                okinawashipping3: '',
                isolatedislandshipping3: '',
                longdistshipping3: '',
                shipname4: '',
                shipfee4: '',
                hokkaidoshipping4: '',
                okinawashipping4: '',
                isolatedislandshipping4: '',
                longdistshipping4: '',
                shipname5: '',
                shipfee5: '',
                hokkaidoshipping5: '',
                okinawashipping5: '',
                isolatedislandshipping5: '',
                longdistshipping5: '',
                shipname6: '',
                shipfee6: '',
                hokkaidoshipping6: '',
                okinawashipping6: '',
                isolatedislandshipping6: '',
                longdistshipping6: '',
                shipname7: '',
                shipfee7: '',
                hokkaidoshipping7: '',
                okinawashipping7: '',
                isolatedislandshipping7: '',
                longdistshipping7: '',
                shipname8: '',
                shipfee8: '',
                hokkaidoshipping8: '',
                okinawashipping8: '',
                isolatedislandshipping8: '',
                longdistshipping8: '',
                shipname9: '',
                shipfee9: '',
                hokkaidoshipping9: '',
                okinawashipping9: '',
                isolatedislandshipping9: '',
                longdistshipping9: '',
                shipname10: '',
                shipfee10: '',
                hokkaidoshipping10: '',
                okinawashipping10: '',
                isolatedislandshipping10: '',
                longdistshipping10: '',
                categoryPath: 'オークション > おもちゃ、ゲーム > ゲーム > トレーディングカードゲーム > 遊戯王（コナミ） > その他',
                LastStartPrice: '',
                startDate: '1625637884',
                endDate: '1625897084',
                location: '埼玉県',
                JpYPayAllowed: 'true',
                allowPayPay: 'true',
                aspj3: '',
                aspj4: '',
                istatus_comment: '',
                retpolicy_comment: '',
                charityOption: '',
                bidCreditLimit: 0,
                BidOrBuyPrice: '',
                Offer: 0,
                initNumResubmit: '',
                markdownPrice1: '',
                markdownPrice2: '',
                markdownPrice3: '',
                ReservePrice: '',
                featuredAmount: '',
                GiftIconName: '',
                itemsizeStr: '－',
                itemweightStr: '－',
                ypkOK: '',
                hacoboon_shipratelink: '',
                intlOK: 0,
                affiliate: 0,
                affiliateRate: '',
                mgc: mgc,
                cpaAmount: '',
                initialFeaturedCharge: '',
                DurationDetail: '',
                BoldFaceCharge: '',
                HighlightListingCharge: '',
                GiftIconCharge: '',
                WrappingIconCharge: '',
                ReserveFeeOnly: '',
                reserveFeeTotal: '',
                SpecificFeeOnly: '0',
                insertionFeeTotal: '0',
                totalCharges: '0',
                IsPrivacyDeliveryAvailable: '',
                ManualStartTime: '1970-01-01T09:00:00+09:00',
                brand_line_id: '',
                brand_line_name: '',
                item_spec_size_id: '',
                item_spec_size_type: '',
                item_spec_size: '',
                item_segment_id: '',
                item_segment: '',
                catalog_id: '',
                catalog_jan_code: '',
                catalog_name: '',
                catalog_spec_select_type: '',
                catalog_spec_numerical_type: '',
                markdown: 0,
                Description_disp: previewParams.Description,
                paymethod1: '',
                paymethod2: '',
                paymethod3: '',
                paymethod4: '',
                paymethod5: '',
                paymethod6: '',
                paymethod7: '',
                paymethod8: '',
                paymethod9: '',
                paymethod10: '',
                shipnameWithSuffix1: '',
                shipratelink1: '',
                shipnameWithSuffix2: '',
                shipratelink2: '',
                shipnameWithSuffix3: '',
                shipratelink3: '',
                shipnameWithSuffix4: '',
                shipratelink4: '',
                shipnameWithSuffix5: '',
                shipratelink5: '',
                shipnameWithSuffix6: '',
                shipratelink6: '',
                shipnameWithSuffix7: '',
                shipratelink7: '',
                shipnameWithSuffix8: '',
                shipratelink8: '',
                shipnameWithSuffix9: '',
                shipratelink9: '',
                shipnameWithSuffix10: '',
                shipratelink10: '',
                bkname1: '',
                bkname2: '',
                bkname3: '',
                bkname4: '',
                bkname5: '',
                bkname6: '',
                bkname7: '',
                bkname8: '',
                bkname9: '',
                bkname10: '',
                SalesContract: 'false',
                hacoboonMiniFeeInfoAreaName1: '',
                hacoboonMiniFeeInfoFee1: '',
                hacoboonMiniFeeInfoAreaName2: '',
                hacoboonMiniFeeInfoFee2: '',
                hacoboonMiniFeeInfoAreaName3: '',
                hacoboonMiniFeeInfoFee3: '',
                hacoboonMiniFeeInfoAreaName4: '',
                hacoboonMiniFeeInfoFee4: '',
                hacoboonMiniCvsPref: '',
                aspj1: '',
                isYahunekoPack: 'true',
                isFirstSubmit: '',
                is_hb_ship: '',
                hb_shipratelink: '',
                hb_ship_fee: '',
                hb_hokkaido_ship_fee: '',
                hb_okinawa_ship_fee: '',
                hb_isolatedisland_ship_fee: '',
                hb_deliveryfeesize: '',
                is_hbmini_ship: '',
                is_yahuneko_taqbin_compact_ship: '',
                yahuneko_taqbin_deliveryfeesize: '',
                is_jp_yupack_official_ship: '',
                jp_yupack_deliveryfeesize: '',
                '.crumb': keys.crumb,
                draftIndex: '',
                is_paypay_fleamarket_cross_listing: 0,
            };
            payload = Qs.stringify(previewParams);
            let resSubmit = await axios.post(`https://auctions.yahoo.co.jp/sell/jp/config/submit`, payload, {
                headers,
            });

            if (Fs.existsSync('./preview.html')) {
                Fs.unlinkSync('./preview.html');
            }
            Fs.writeFile('./preview.html', resSubmit.data, function (err, data) {
                if (err) {
                    return console.log(err);
                }
            });

            response.success200({ mgc });
        } catch (error) {
            console.log(error);
            console.log(error.response);

            response.error500(error);
        }
    }

    static async updateProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            let {
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
                gift_icon,
            } = req.body;
            let user = req.user;

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
                gift_icon,
            };

            let result = await ProductYahooService.update(_id, data);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
            response.error500(error);
        }
    }

    static async getDetailProduct(req, res) {
        let response = new Response(res);
        try {
            const { _id } = req.params;
            console.log(_id);
            let result = await ProductYahooService.show(_id);
            if (result) {
                response.success200(result);
            }
        } catch (error) {
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
