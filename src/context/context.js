import React, { useState, useEffect, useContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext()

const GithubProvider = ({children}) => {      

      const [githubUser,setgithubUser] = useState(mockUser)
      const [repos,setRepos] = useState(mockRepos)
      const [followers,setFollowers] = useState(mockFollowers)
      const [requests,setRequests] = useState(0)
      const [isLoading,setisLoading] = useState(false)
      const [error,setError] = useState({show:false,msg:""})


      const checkRequest = () => {
            axios(`${rootUrl}/rate_limit`)
            .then((res) => {
                  let remaining = res.data.rate.remaining
                  setRequests(remaining)
                  if(remaining === 0){
                        toggleError(true,"sorry you have passed your hourly rate limit!")
                  }
            })
            .catch((err) => console.log(err))
      }

      const searchGithubUser = async(user) => {
            setisLoading(true)
            toggleError()
            let response = await axios(`${rootUrl}/users/${user}`).catch(
                  err => console.log(err)
            )
            if(response){
                  setgithubUser(response.data)
                  const {repos_url,followers_url} = response.data;

                  await Promise.allSettled([
                        axios(`${repos_url}?per_page=100`),
                        axios(`${followers_url}?per_page=100`)
                  ]).then((results) => {
                        const status = "fulfilled"
                        const [repos,followers] = results
                        if(repos.status === status){
                              setRepos(repos.value.data)
                        }
                        if(followers.status === status){
                              setFollowers(followers.value.data)
                        }

                  }).catch(err => console.log(err))
            }
            else{
                  toggleError(true,"No user by that name")
            }
            checkRequest()
            setisLoading(false)
      }

      function toggleError(show=false,msg=''){
            setError({show,msg})
      }

      useEffect(checkRequest,[])

      return <GithubContext.Provider value={{githubUser,setgithubUser,repos,followers,requests,error,searchGithubUser,isLoading}}>
            {children}
      </GithubContext.Provider>
}

export {GithubProvider,GithubContext}
