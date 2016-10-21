import React, {Component, PropTypes} from 'react';
import Todos from './Todos/Todos';
import MainLayout from '../layouts/MainLayout/MainLayout';
const imgDatas = require('../data/imageDatas.json');

//在imgDatas添加图片地址
imgDatas.forEach((imgData, index)=> {
    imgDatas[index].imgURL = require('../images/' + imgData.fileName);
});

//随机数函数
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//随机图片旋转角度
function get30Degree() {
    return (Math.random() > 0.5 ? '' : '-') + Math.random() * 30;
}

//每张图片的类
class ImgFigure extends Component {
    handleClick(e) {
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        let styleObj = this.props.arrange.pos || {};
        if (this.props.arrange.rotate) {
            styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
        }

        let imgFigureClassName = 'img-figure';
        if (this.props.arrange.isInverse) {
            imgFigureClassName += ' is-inverse';
        }

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
                <img src={this.props.data.imgURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick.bind(this)}>
                        <p>{this.props.data.desc}</p>
                    </div>
                </figcaption>
            </figure>
        )
    }
}

class ControllerUnit extends Component {
    handleClick(){

    }
    render(){
        let controllerUnitClassName = "controller-unit";
        if(this.props.arrange.isCenter){
            controllerUnitClassName += ' is-center';
            if(this.props.arrange.isInverse){
                controllerUnitClassName += ' is-inverse';
            }
        }
        return (
            <span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
        )
    }
}

class App extends Component {
    constructor() {
        super();
        this.Constant = {
            centerPos: {
                x: 0,
                y: 0
            },
            hPosRange: {
                hPosRangeLeftX: [0, 0],
                hPosRangeRightX: [0, 0],
                hPosRangeY: [0, 0]
            },
            vPosRange: {
                x: [0, 0],
                topY: [0, 0]
            }
        };
        this.state = {
            imgsArrangeArr: []
        }
    }

    /**
     * 翻转图片
     * @param index
     * return {function} 这是个闭包函数,其内return一个真正待被执行的函数
     */
    inverse(index) {
        return ()=> {
            let imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }
    }

    /**
     * 点击图片后,该图片居中,其他图片居中显示
     */
    center(index) {
        return ()=> {
            this.rearrange(index);
        }
    }

    /**
     *  重新安排图片的位置
     *  @param centerIndex 居中图片的index
     */

    rearrange(centerIndex) {
        let Constant = this.Constant,
            imgsArrangeArr = this.state.imgsArrangeArr,
            centerPosX = Constant.centerPos.x,
            centerPosY = Constant.centerPos.y,
            vPosRangeX = Constant.vPosRange.x,
            vPosRangeY = Constant.vPosRange.topY,
            hPosRangeLeftX = Constant.hPosRange.hPosRangeLeftX,
            hPosRangeRightX = Constant.hPosRange.hPosRangeRightX,
            hPosRangeY = Constant.hPosRange.y,

            imgArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),
            topImgSpliceIndex = 0,

            imgArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
        //布局居中的图片,没有旋转
        imgArrangeCenterArr[0] = {
            pos: {
                left: centerPosX,
                top: centerPosY
            },
            rotate: 0,
            isInverse: false,
            isCenter: true
        };
        //布局上侧图片
        topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
        imgArrangeTopArr.forEach((value, index)=> {
            imgArrangeTopArr[index] = {
                pos: {
                    left: getRandom(vPosRangeX[0], vPosRangeX[1]),
                    top: getRandom(vPosRangeY[0], vPosRangeY[1])
                },
                rotate: get30Degree(),
                isInverse: false,
                isCenter: false
            }
        });
        //布局左侧 右侧的图片
        for (let i = 0, len = imgsArrangeArr.length; i < len; i++) {
            let hPosRangeLORX = null;
            hPosRangeLORX = (i < len / 2) ? hPosRangeLeftX : hPosRangeRightX;
            imgsArrangeArr[i] = {
                pos: {
                    left: getRandom(hPosRangeLORX[0], hPosRangeLORX[1]),
                    top: getRandom(hPosRangeY[0], hPosRangeY[1])
                },
                rotate: get30Degree(),
                isInverse: false,
                isCenter: false
            }
        }

        if (imgArrangeTopArr && imgArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        })
    }

    //当组件加载完成时,计算每张图片的位置范围
    componentDidMount() {
        const stageDOM = this.refs.stage,
            imgW = 320,
            imgH = 360;
        let stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight;
        //居中图片
        this.Constant.centerPos.x = stageW / 2 - imgW / 2;
        this.Constant.centerPos.y = stageH / 2 - imgH / 2;
        //上侧图片
        this.Constant.vPosRange.x = [stageW / 2 - imgW, stageW / 2];
        this.Constant.vPosRange.topY = [-imgH / 2, stageH / 2 - imgH * 3 / 2];
        //左侧 右侧图片
        this.Constant.hPosRange.hPosRangeLeftX = [-imgW / 2, stageW / 2 - imgW * 3 / 2];
        this.Constant.hPosRange.hPosRangeRightX = [stageW / 2 + imgW / 2, stageW - imgW / 2];
        this.Constant.hPosRange.y = [-imgH / 2, stageH - imgH / 2];

        this.rearrange(0);
    }

    render() {
        let imgFigures = [],
            controllerUnits = [];
        imgDatas.forEach((value, index)=> {
            //初始化每张图片的state
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }
            imgFigures.push(<ImgFigure key={index} data={value} arrange={this.state.imgsArrangeArr[index]}
                                       inverse={this.inverse(index)} center={this.center(index)}/>);
            controllerUnits.push(<ControllerUnit key={index} data={value} arrange={this.state.imgsArrangeArr[index]}
                                                 inverse={this.inverse(index)} center={this.center(index)}/>)
        });
        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        )
    }
}

App.propTypes = {};

export default App;
