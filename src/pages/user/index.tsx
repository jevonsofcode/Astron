import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button, Image } from "@tarojs/components";
import { collections_which } from "@/api";
import { observer, inject } from "@tarojs/mobx";
import "./main.scss";

interface Mine {
    props: {
        userInfo: {
            info: {
                nickName: string,
                avatarUrl: string
            },
            _id: string,
            collections: any, // TODO 数组
            whichColls: any, // TODO 数组
            getStorageInfo: Function,
            getStorageID: Function,
            onLoginByWeapp: Function,
            isGetUserInfo: Function
        }
    };
}

type IREDATA = {
    code: number; // string
    msg: {} | []
};

@inject("userInfo")
@observer
class Mine extends Component {
    constructor(props) {
        super(props);
        this.clickCollections = this.clickCollections.bind(this);
    }

    config = {
        navigationBarTitleText: "ASTRON"
    };

    componentWillMount() {
        console.log("我的页是否有信息呢","avatarUrl" in this.props.userInfo.info);
        console.log("我的页是否有id信息呢",!!this.props.userInfo._id);
        !("avatarUrl" in this.props.userInfo.info) &&
        this.props.userInfo.getStorageInfo();

        !this.props.userInfo._id &&
        this.props.userInfo.getStorageID();
    }

    /**
     * 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息
     */
    onLoginByWeapp = () => {
        // e.stopPropagation();
        this.props.userInfo.onLoginByWeapp();
    }

    // 原生方法拿信息
    getUserInfo = (userInfo) => {
        if(userInfo.detail&&userInfo.detail.userInfo){ //同意
            console.log("userInfo.detail",userInfo.detail);
            this.props.userInfo.isGetUserInfo(userInfo.detail.userInfo);
        } else { //拒绝,保持当前页面，直到同意
        }
    }

    render() {
        console.log(")))))",(this.props.userInfo._id));
        console.log("现在是render中 是否有info nickName", this.props.userInfo.info.nickName);
        const nickName = this.props.userInfo.info.nickName;
        const avatarUrl = this.props.userInfo.info.avatarUrl;
        const _id = this.props.userInfo._id;
        return(
            <View className="mine-style">
                {
                    (!nickName)&&(!_id) ? (
                        <View className="mine-style-unknow">
                            <Text>申请获取你的公开信息（昵称、头像等）</Text>
                            <Button
                                open-type="getUserInfo"
                                onGetUserInfo={this.getUserInfo}>
                                微信授权
                            </Button>
                        </View>
                    ) : (
                        <View className="mine-style-know">
                            <View className="info-box">
                                <Image className="info-head" src={avatarUrl} />
                                <Text className="info-name">{nickName}</Text>
                            </View>
                            <View className="option-box">
                                <View className="option-item" onClick={this.clickCollections}>
                                    <View className="at-icon at-icon-star option-item-icon" />
                                    我的收藏
                                </View>
                                <View className="option-item">
                                    <View className="at-icon at-icon-mail option-item-icon" />
                                    意见建议
                                </View>
                                <View className="option-item">
                                    <View className="at-icon at-icon-alert-circle option-item-icon" />
                                    关于Astron
                                </View>
                            </View>
                        </View>
                    )
                }
            </View>
        );
    }

    /**
     * 点击收藏跳转的时候就请求 `collections_find` 接口，把数据存在 mobx 中
     * 通过 `collections_which` 把 _id 换文章
     */
    clickCollections() {
        // 边跳转 边请求 pass ×

        // const this_ = this;
        if(this.props.userInfo._id.length < 1) {
            console.log(this.props.userInfo);
            return false;
        }
        const collections = this.props.userInfo.collections.slice();

        console.log("当前请求的数组是:", collections);

        if(collections===[]||collections.length<1) {
            console.log("还没有收藏");
            Taro.navigateTo({
                url: "/pages/collections/index"
            });
            return;
        }

        console.log(Array.isArray(collections));
        collections_which({ collections }).then((r:any) => {
            if(r.data.code > 0) {
                console.log(r.data.msg);
                // 把这些文章存入 mobx
                this.props.userInfo.whichColls = r.data.msg;
                Taro.navigateTo({
                    url: "/pages/collections/index"
                });
                return true;
            }
            Taro.showToast({
                title: "请求失败002~",
                icon: "none",
                mask: true,
                duration: 1200
            });
        }).catch((e) => {
            // TODO 埋点 e
            console.log("跳转的catch", e);
            Taro.showToast({
                title: "请求失败003~",
                icon: "none",
                mask: true,
                duration: 1200
            });
        });


        // 好像没必要再请求这个了
        // const _id = this.props.userInfo._id;
        // collections_find({ _id }).then((colls) => {
        //     console.log("收藏", colls.data.msg.collections.slice());
        //     if(colls.data.code === "1000") {
        //         this_.props.userInfo.collections = colls.data.msg.collections; // mobx 中有收藏列表了

        //         // 根据收藏列表把文章详情请求回来
        //     } else {
        //         console.log("返回不是1000，记着写个提示");
        //     }
        // });
    }
}

export default Mine;
