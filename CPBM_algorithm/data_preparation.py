import pandas as pd


def create_dataset():
    data = {
        'text': [
            # 旅行主题
            "我们在瑞士旅行时参观了美丽的阿尔卑斯山。",
            "日本的樱花季节吸引了大量游客。",
            "中国的长城是世界闻名的历史遗迹。",
            "法国的卢浮宫收藏了许多世界著名的艺术品。",
            "意大利的美食和文化吸引了众多游客。",
            "美国的大峡谷是自然奇观。",
            "埃及的金字塔是古代文明的象征。",
            "希腊的帕特农神庙吸引了许多历史爱好者。",
            "澳大利亚的大堡礁是潜水爱好者的天堂。",
            "巴西的亚马逊雨林是地球之肺。",
            "印度的泰姬陵是爱情的象征。",
            "英国的大本钟是伦敦的标志。",
            "俄罗斯的红场是莫斯科的中心。",
            "加拿大的尼亚加拉大瀑布是自然奇观。",
            "南非的开普敦有壮丽的海岸线。",
            "阿根廷的伊瓜苏瀑布是世界最大的瀑布之一。",
            "冰岛的蓝湖是著名的温泉胜地。",
            "新西兰的米尔福德峡湾是自然奇观。",
            "挪威的峡湾风景如画。",
            "葡萄牙的里斯本有丰富的历史文化。",
            "西班牙的巴塞罗那有高迪的建筑作品。",
            "荷兰的风车村是传统文化的代表。",
            "比利时的布鲁塞尔有美丽的广场。",
            "奥地利的维也纳是音乐之都。",
            "瑞典的斯德哥尔摩是北欧的威尼斯。",

            # 运动主题
            "早晨的慢跑让人精神焕发，特别是在公园里。",
            "瑜伽不仅锻炼身体，还能放松心灵。",
            "游泳是一项全身运动，有助于增强体质。",
            "每天坚持跑步有助于减肥和提高心肺功能。",
            "爬山不仅能锻炼身体，还能欣赏美景。",
            "跳舞是一种有趣的健身方式。",
            "骑自行车是一种环保的运动方式。",
            "打篮球可以提高团队合作能力。",
            "足球是世界上最受欢迎的运动。",
            "网球不仅能锻炼反应能力，还能增强体质。",
            "羽毛球是一项老少皆宜的运动。",
            "高尔夫是一种高雅的运动。",
            "滑雪是一项刺激的冬季运动。",
            "冲浪是一种极限运动。",
            "攀岩是一项挑战自我的运动。",
            "马拉松是一项耐力运动。",
            "跆拳道是一种防身术。",
            "拳击是一项力量与技巧并重的运动。",
            "体操是一项优美的运动。",
            "射箭是一项需要集中注意力的运动。",
            "滑板是一种街头运动。",
            "赛艇是一项团队合作的运动。",
            "冰球是一项速度与力量的结合。",
            "橄榄球是一项激烈的运动。",
            "乒乓球是一项中国的国球。",

            # 宠物主题
            "我的小狗总是充满了活力和好奇心。",
            "宠物狗的训练需要耐心和技巧。",
            "猫咪喜欢在阳光下打盹。",
            "养宠物可以带来很多快乐和陪伴。",
            "宠物猫的毛发护理需要定期进行。",
            "宠物鸟的歌声让人愉悦。",
            "鱼缸里的热带鱼色彩斑斓。",
            "兔子是温顺的宠物。",
            "仓鼠是孩子们喜欢的小宠物。",
            "蜥蜴是一些人的奇特宠物选择。",
            "乌龟是长寿的象征。",
            "鹦鹉会模仿人类的语言。",
            "狗狗是人类最忠诚的朋友。",
            "猫咪有独立的个性。",
            "宠物蛇是一些人的独特爱好。",
            "宠物兔需要足够的活动空间。",
            "宠物仓鼠需要一个舒适的笼子。",
            "宠物鸟需要一个宽敞的鸟笼。",
            "鱼缸需要定期清洁。",
            "宠物狗需要每天遛弯。",
            "猫咪需要定期梳理毛发。",
            "宠物兔喜欢吃新鲜的蔬菜。",
            "宠物仓鼠喜欢在轮子上跑步。",
            "宠物蛇需要一个温暖的环境。",
            "宠物乌龟需要一个水池。",

            # 健康主题
            "定期体检是保持健康的重要手段。",
            "均衡饮食对维持身体健康至关重要。",
            "保持良好的睡眠习惯对健康非常重要。",
            "多喝水有助于身体排毒和保持健康。",
            "每天适量运动有助于提高免疫力。",
            "减少糖分摄入有助于控制体重。",
            "多吃水果和蔬菜有助于消化。",
            "保持心情愉快有助于心理健康。",
            "定期洗手可以预防疾病。",
            "避免久坐有助于保护脊椎。",
            "适量晒太阳可以补充维生素D。",
            "避免熬夜有助于身体恢复。",
            "保持口腔清洁可以预防牙齿疾病。",
            "定期检查眼睛可以保护视力。",
            "多吃富含纤维的食物可以促进肠道健康。",
            "戒烟有助于肺部健康。",
            "减少酒精摄入有助于肝脏健康。",
            "多做深呼吸有助于放松身心。",
            "保持良好的坐姿可以预防腰背痛。",
            "定期进行全身按摩有助于放松肌肉。",
            "多吃坚果有助于大脑健康。",
            "保持适当的体重有助于预防慢性疾病。",
            "定期进行血压测量可以预防高血压。",
            "多吃鱼类有助于心脏健康。",
            "保持适度的锻炼有助于延缓衰老。",
        ]
    }

    df = pd.DataFrame(data)
    df.to_csv('text_dataset_100.csv', index=False)
    print("Dataset store at 'text_dataset_100.csv'")


if __name__ == "__main__":
    create_dataset()