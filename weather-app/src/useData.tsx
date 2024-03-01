import axios from 'axios'
import { useState, useEffect } from 'react';

const useData = (url: string) => {

    const [listData, setListData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(url).then((response) => {
            setListData(response.data);
            setIsLoading(false);
            setError(null);
        })
            .catch((err) => {
                if (err.response) {
                    const { status } = err.response;

                    if (status === 401) {
                        console.log('client needs authentication')
                        setIsLoading(false);
                        setError(err.message)
                    }
                    else if (status === 502) {
                        console.log('invalid response')
                        setIsLoading(false);
                        setError(err.message)
                    }
                }
                else if (err.request) {
                    console.log('no response')
                    setIsLoading(false);
                    setError(err.message)
                }
                else {
                    console.log('some other kind of error')
                    setIsLoading(false);
                    setError(err.message)
                }
            }
            )
    }, []);

    return { listData, isLoading, error }
}

export default useData;