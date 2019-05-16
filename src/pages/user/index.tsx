import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";

class ShowNews1 extends Component {
    constructor(preps) {
        super(preps);

        this.switchTab = this.switchTab.bind(this);
    }

    config = {
        navigationBarTitleText: "我也是一个页面"
    };

    switchTab() {
        Taro.switchTab({
            url: "../show-news/index"
        });
    }

    render() {
        return(
            <View>
                <View className="page-demo">
                    <Text className="mx-1" onClick={this.switchTab}>gogogo</Text>
                </View>
            </View>
        );
    }
}

export default ShowNews1;
