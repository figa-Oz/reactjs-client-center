import React , { useState } from 'react'

// MODULE
import axios from 'axios'
import { useSelector } from 'react-redux'

// MATERIAL ICONS
import SendIcon from '@material-ui/icons/Send';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';


// COMPONENTS
import Reply from './Reply'

// STYLE
import './style.css'
import './comment.css'

// API
import {  SWAGGER_URL } from '../../../Support/API_URL'

function QA (props) {

    // PARENT PROPS
    const { detailData , getData , videoId , loadingComment, setLoadingComment , type } = props

    // GLOBAL STATE
    const userInfo = useSelector(({ user }) => user.userMe);

    // LOCAL STATE
    const [commentIn,setCommentIn] = useState("")

    // LOCAL STATE SHOW REPLY
    const [selectedShow,setSelectedShow] = useState([])

    // LOCAL STATE HANDLE REPLY SELECT INPUT
    const [selectReply,setSelectReply] = useState(null)

    // LOCAL STATE INPUT AUTOFOCUS
    const [focus,setFocus] = useState(false)
 
    let addComment = () => {
        axios({
            method : 'POST',
            // url : `${SWAGGER_URL}/contents`,
            url : `${SWAGGER_URL}/comments/${type}/${videoId}/new`,
            data : {
                comment : commentIn
            },
            headers : {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(({data})=>{
            console.log(data , ' <<< RESULT DATA HERE')
            setCommentIn(null)
            getData()
        })
        .catch(err=>{
            console.log(err.response , ' <<< ERROR COMMENT')
        })
    }

    let addLike = (id) => {
        console.log(id , ' comment id')
        axios({
            method : 'POST',
            // url : `${SWAGGER_URL}/contents`,
            url : `${SWAGGER_URL}/comments/${id}/like`,
            headers : {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(({data})=>{
            if (data.message === "like this comment sucessfuly") {
                console.log('MASUK HERE lol lL')
                getData()
            }
        })
        .catch(err=>{
            console.log(err.response)
        })
    }

    let minLike = (id) => {
        console.log(id , ' comment id')
        axios({
            method : 'POST',
            // url : `${SWAGGER_URL}/contents`,
            url : `${SWAGGER_URL}/comments/${id}/cancel-like`,
            headers : {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(({data})=>{
            getData()
        })
        .catch(err=>{
            console.log(err.response)
        })
    }

    let addReply = () => {
        axios({
            method : 'POST',
            // url : `${SWAGGER_URL}/contents`,
            url : `${SWAGGER_URL}/comments/${selectReply.id}/reply`,
            data : {
                react_to : {
                    // id : selectReply.id,
                    user : selectReply.user._id
                },
                comment : commentIn
            },
            headers : {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(({data})=>{
            console.log(data , ' <<<< hasil data')
            console.log('SUKSES ADD REPLY')
            
            let arr = [...selectedShow]
            arr.push(selectReply.id)
            if (selectedShow.filter(e=>e === selectReply.id).length === 0 ) {
                setSelectedShow(arr)
            }
            setCommentIn("")
            getData()
        })
        .catch(err=>{
            console.log(err.response , ' <<< HASIL ERROR HERE')
        })
    }

    let checkInput = () => {
        if (selectReply && commentIn) {
            if (selectReply.user.name.split(" ")[0] === commentIn.split(" ")[0].split("@")[1] ) {
                addReply()
            }else {
                addComment()
            }
        }else {
            addComment()
        }
    }

    // HANLDE WHEN REPLY TEXT TRIGGERED
    let handleReply = (data) => {
        setSelectReply(data)
        setCommentIn(`@${data.user.name} `)
        setFocus(true)
        let sel = document.getElementById('input-comment-1')
        sel.focus()
        sel.scrollIntoView({behavior : "smooth"})
    }

    // HANLDE SHOW REPLY WITH TEXT "Lihat Balasan"
    let handleShowReply = (id) => {
        if (selectedShow.filter(e=>e === id).length === 0 ) {
            let arr = [...selectedShow]
            arr.push(id)
            setSelectedShow(arr)
        }
    }

    let renderLikeI = (e) => {
        if (e.likes.length > 0 && userInfo && userInfo.user ) {
            let checkArr = e.likes.filter(e2=>e2.liked_by._id === userInfo.user._id)
            // console.log()
            if (checkArr.length > 0) {
                return (
                    <FavoriteIcon
                        style={{fontSize : 20,marginRight : 6,cursor : "pointer",color : "red"}}
                        onClick={()=>minLike(e._id)}
                    />
                )
            }else {
                return (
                    <FavoriteBorderIcon
                        onClick={()=>addLike(e._id)}
                        style={{fontSize : 20,marginRight : 6,cursor : "pointer"}}
                    />
                )
            }
        }else {
            return (
                <FavoriteBorderIcon
                    onClick={()=>addLike(e._id)}
                    style={{fontSize : 20,marginRight : 6,cursor : "pointer"}}
                />
            )
        }
    }

    return (
        <div className="cd-qa-13" id="comment-container-2" style={{margin: "0 0 70px 0"}}>
            {/* <div className="c1">
                Sort by
            </div> */}
            <div className="c2">
                {/* <div className="t1">
                    SR
                </div> */}
                <img
                    className="t1"
                    alt="profile-avatar"
                    src={userInfo.avatar}
                />
                <div className="t2">
                    <input 
                        placeholder={"Silahkan Isi Komentar!"}
                        onChange={e=>setCommentIn(e.target.value)}
                        value={commentIn}
                        // autoFocus={focus}
                        // ref={"input"}
                        id="input-comment-1"
                    />
                    <div>
                        <SendIcon
                            // onClick={e=>addComment()}
                            onClick={e=>checkInput()}
                        />
                    </div>
                </div>
            </div>
            {
                detailData && detailData.sort((a,b)=>new Date(b.created_at) - new Date(a.created_at)).map(e=>{
                    console.log(e , ' <<< VALUE E HERE LOL')
                    return (
                        <div className="c3" key={e._id}>

                            <img
                                alt="avatar-user"
                                src={e.user.avatar}
                                className="t1"
                            />
                            {/* <div className="t1">
                                RH
                            </div> */}
                            
                            <div className="t2">
                                <div className="d1">
                                    {e.user.name}
                                </div>
                                <div className="d2">
                                    {e.comment}
                                </div>
                                <div className="d3">
                                    {/* <i 
                                        className="fa fa-heart" 
                                        style={{ fontSize : 17, marginRight : 5}}
                                    >

                                    </i> */}
                                    {
                                        renderLikeI(e)
                                    }
                                    
                                    <div className="like">
                                        {e.likes.length} likes
                                    </div>
                                    <span onClick={()=>handleReply({ id : e._id, user : e.user})}>
                                        Jawab
                                    </span>
                                    {/* <div className="dot">
                                        
                                    </div>
                                    <span onClick={()=>addLike(e._id)}>
                                        Setuju
                                    </span> */}
                                </div>
                                {
                                    e.reactions.length > 0 &&
                                    <div className="d4">
                                        <div className="line">

                                        </div>
                                        <div
                                            onClick={()=>handleShowReply(e._id)}
                                            className="text1"
                                        >
                                            Lihat Balasan
                                        </div>
                                    </div>
                                }
                                {
                                    selectedShow.filter(el=>el === e._id).length > 0 &&
                                    e.reactions.map((e2)=>{
                                        console.log(e2 , ' <<< E2')
                                        return (
                                            <Reply
                                                reaction={e2}
                                                e={e}
                                            />
                                        )
                                    })
                                }
                                
                            </div>
                        
                        </div>
                    )
                })
            }
            
        </div>
    )

}

export default QA