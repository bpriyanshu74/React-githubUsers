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
      const [loading,setLoading] = useState(false)

      const checkRequest = () => {
            axios(`${rootUrl}/rate_limit`)
            .then((res) => {
                  console.log(res)
            })
            .catch((err) => console.log(err))
      }

      useEffect(checkRequest,[])

      return <GithubContext.Provider value={{githubUser,setgithubUser,repos,setRepos,followers,setFollowers}}>
            {children}
      </GithubContext.Provider>
}

export {GithubProvider,GithubContext}
