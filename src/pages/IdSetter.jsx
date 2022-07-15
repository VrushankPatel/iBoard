import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom';

function IdSetter() {
    let { uid } = useParams();
    let history = useHistory();
    useEffect(() => {
        localStorage.uid = uid;
        history.push('/');
    });

    return (
        <div>
            Securely redirecting you to your iBoard..
        </div>
    );
}

export default IdSetter;