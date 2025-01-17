import React, { useEffect , useState } from 'react';

// MODULES
import { Breadcrumb, Select, Input, Comment, Tooltip, List } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios'

// COMPONENTS
import TopicSection from '../../Components/TopicSection';
import Footer from '../../Components/LMSFooter';
import QA from '../../Components/LMS-Video/QA'

// GLOBAL ACTIONS
import { getBlogById, getBlogList } from '../../Redux/Actions';
import { setAvailableMenu } from '../../Redux/Actions/userAction'

// API SWAGGER
import { SWAGGER_URL } from '../../Support/API_URL'

// STYLE
import './TipsDetail.css';

const { Option } = Select;

const TipsDetail = (props) => {
    const dispatch = useDispatch();

    // PROPS
    const queryId = props.location.search.split('=')[1];

    // GLOBAL STATE
    const blogList = useSelector(({ content }) => content.blogList);
    const blogById = useSelector(({ content }) => content.blogById);

    // LOCAL STATE
    const [tips,setTips] = useState(null)
    const [dataComment,setDataComment] = useState(null)
    const [loadingComment,setLoadingComment] = useState(false)
    const [spotlight,setSpotlight] = useState(null)
    
    useEffect(() => {
        document.title = 'LMS Tips Detail';
        dispatch(getBlogById(queryId));
        dispatch(getBlogList());
    }, [dispatch, queryId]);

    let getCommment = () => {
        let id = props.location.pathname.split('/')[3]
        axios({
            method : 'GET',
            url : `${SWAGGER_URL}/comments/content/${id}/detail`,
            headers : {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(({data})=>{
            setDataComment(data.data)
            console.log(data.data , ' <<<< VALUE DATA COMMENTS HERE')
        })
        .catch(err=>{
            console.log(err.response , " <<< ERROR RESPONSE")
        })
    }

    useEffect(()=>{
        let slug = props.location.pathname.split('/')[2]
        let id = props.location.pathname.split('/')[3]
        getCommment()
        axios({
            method : 'GET',
            url : `${SWAGGER_URL}/lms/${slug}/tips/${id}`,
            headers : {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(({data})=>{
            setTips(data.data.tips)
            setSpotlight(data.data.spotlight)
            dispatch(setAvailableMenu(data.data.available_menu))
            console.log(data , "  VALUE DETAIL TIPS ((((((**" )
        })
        .catch(err=>{
            console.log(err.response , ' <<< ERROR HERE')
        })
    },[])

    const breadCrumbs = [
        "Laruno",
        "Tips",
        "Inside ByteDance's edtech expansion",
    ];

    const comments = [
        {
            actions: [<span key="comment-list-reply-to-0">Reply to</span>],
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: (
                <p>
                    We supply a series of design principles, practical patterns and high quality design
                    resources (Sketch and Axure), to help people create their product prototypes beautifully and
                    efficiently.
                </p>
            ),
            datetime: (
                <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{moment().subtract(1, 'days').fromNow()}</span>
                </Tooltip>
            ),
        },
        {
            actions: [<span key="comment-list-reply-to-0">Reply to</span>],
            author: 'Han Solo',
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: (
                <p>
                    We supply a series of design principles, practical patterns and high quality design
                    resources (Sketch and Axure), to help people create their product prototypes beautifully and
                    efficiently.
                </p>
            ),
            datetime: (
                <Tooltip title={moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{moment().subtract(2, 'days').fromNow()}</span>
                </Tooltip>
            ),
        },
    ];

    const renderArticle = () => {
        return (
            <div>
                <Breadcrumb className='tipsdetail-breadcrumbs'>
                    <Breadcrumb.Item>
                        {breadCrumbs[0]}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {breadCrumbs[1]}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        { tips && tips.title}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className='tipsdetail-author-details'>
                    <img 
                        src='https://pbs.twimg.com/media/ETKeT7wWAAAsxFY.jpg' 
                        alt='author' 
                        className='tipsdetail-author-picture' 
                    />
                    {/* <div className='tipsdetail-author-desc'>
                        John Doe ● 4h ago ● 5 min read
                    </div> */}
                </div>
                <div className='tipsdetail-article-section'>
                    <div className='tipsdetail-article-title'>
                        <b>{blogById.title}</b>
                    </div>
                    <img 
                        // src="https://img.freepik.com/free-photo/front-view-shopping-cart-with-lots-coins-jar_23-2148569118.jpg?size=626&ext=jpg"
                        src={tips && tips.image}
                        alt="article illustration" 
                        className="tipsdetail-article-picture"
                    />
                    <div className='tipsdetail-article-social-share'>
                        <button className='tipsdetail-article-facebook'>
                            Facebook
                        </button>
                        <button className='tipsdetail-article-whatsapp'>
                            Whatsapp
                        </button>
                    </div>
                    <div className='tipsdetail-article-showoff'>
                        {tips && tips.desc}
                    </div>
                    <div className='tipsdetail-article-paragraphs'>
                        {tips && tips.desc}
                    </div>
                    {/* <div className='tipsdetail-article-paragraphs'>
                        Hello readers, <br/> {blogById.desc}
                    </div> */}
                </div>
                {/* <div>
                    <Select
                        showSearch
                        className='tipsdetail-comment-sort'
                        placeholder="Sort by"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Option>Newest</Option>
                        <Option>Oldest</Option>
                    </Select>
                    <div className='tipsdetail-comment-user-section'>
                        <img
                            src='https://i.pinimg.com/originals/2d/0a/ee/2d0aee4df7929611bd7bea99af17283f.jpg'
                            alt='user'
                            className='tipsdetail-comment-user-image'
                        />
                        <Input placeholder="Your comment here..." />
                    </div>
                    <List
                        className="comment-list"
                        header={`${comments.length} replies`}
                        itemLayout="horizontal"
                        dataSource={comments}
                        renderItem={item => (
                            <li>
                                <Comment
                                    actions={item.actions}
                                    author={item.author}
                                    avatar={item.avatar}
                                    content={item.content}
                                    datetime={item.datetime}
                                />
                            </li>
                        )}
                    />
                </div> */}
            </div>
        );
    };

    const renderSpotlight = () => {
        <div style={{marginTop:'10px'}}>
            <span className='tipsdetail-spotlight-tag'>
                News Spotlight
            </span>
            <div className='tipsdetail-spotlight-title'>
                Say hello to Singapore's first digital banks
            </div>
            <img 
                src='https://cdn.techinasia.com/wp-content/uploads/2020/12/bytedance-dali.gif'
                alt='spotlight'
                className='tipsdetail-spotlight-image'
            />
            <div className='tipsdetail-spotlight-article'>
                After months of suspense, Singapore finally unveiled the winners for its digital bank licenses. <br/><br/> * Drum roll please: Sea Group and the Grab Holdings and Singtel partnership received the digital full bank licenses. Meanwhile, Ant Group as well as the Greenland Financial Holdings, Linklogis Hong Kong, and Beijing Co-operative Equity Investment Fund Management consortium were awarded the digital wholesale bank licenses. <br/><br/> * Grab-Singtel made its moves: The Grab-Singtel consortium didn’t miss a beat. Shortly after the announcement, it appointed Citigroup veteran Charles Wong as its chief executive and said that it will set up a team of 200 people by the end 2021. <br/><br/> * Razer fintech looks elsewhere: While Razer Fintech failed to receive the digital bank license, the company announced plans to roll out Razer Youth Bank in markets such as Malaysia and the Philippines instead.
            </div>
        </div>
        // return [0].map((val,index) => {
        //     return (
        //     );
        // });
    };

    const renderBlogs = () => {
        return blogList.map((val,index) => {
            return (
                <div className='larunoblog-spotlight-container'>
                    <img 
                        src='https://www.pewresearch.org/wp-content/uploads/sites/8/2016/07/PJ_2016.07.07_Modern-News-Consumer_0-01.png' 
                        alt='recommentation' 
                        className='larunoblog-spotlight-product-image' 
                    />
                    <div className='larunoblog-spotlight-product-details'>
                        <div className='larunoblog-spotlight-product-name'>
                            <b>{val.title}</b>
                        </div>
                        <div className='larunoblog-spotlight-product-desc'>
                            {val.desc}
                        </div>
                        <div className='larunoblog-spotlight-author-section'>
                            <img 
                                src='https://pbs.twimg.com/media/ETKeT7wWAAAsxFY.jpg'
                                alt='author'
                                className='larunoblog-spotlight-author-image'
                            />
                            <div className='larunoblog-spotlight-author-desc'>
                                John Doe ● 4h ago ● 5 min read
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className='root'>
            {/* SECTION CAROUSEL */}
            <div style={{marginTop:'20px'}}>
                <TopicSection {...props} tipsTab={true} />
            </div>

            {/* DIVIDER */}
            <div className='divider' />

            {/* ARTICLE */}
            <div className='article-section'>
                {renderArticle()}
            </div>

            {/* COMMENTS */}
            <div className="video-comment-title-1">
                Silahkan Kirim Pertanyaan Anda
            </div>

            {
                dataComment && 
                <div style={{width : "100%",display : "flex" , alignItems : "center" , flexDirection : "column"}}>
                    <QA
                        detailData={dataComment}
                        getData={getCommment}
                        videoId={props.location.pathname.split('/')[3]}
                        loadingComment={loadingComment}
                        setLoadingComment={setLoadingComment}
                        type={"content"}
                    />
                </div>
            }

            {/* DIVIDER */}
            <div className='divider' />

            {/* SPOTLIGHT */}
            <div className='spotlight-section'>
                {renderSpotlight()}
            </div>

            {/* DIVIDER */}
            <div className='divider' />

            {/* BLOG */}
            <div className='larunoblog-section'>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'5px'}}>
                    <div className='larunoblog-title'>
                        Laruno's Blogs
                    </div>
                    <div className='larunoblog-see-more'>
                        See more
                    </div>
                </div>
                <div className='larunoblog-spotlight-renderer'>
                    {renderBlogs()}
                </div>
            </div>

            {/* FOOTER */}
            <div className='lms-tips-detail-footer'>
                <Footer />
            </div>
        </div>
    );
};

export default TipsDetail;
