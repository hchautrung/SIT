import React from 'react';

export default function LoadingBox ({label}) {
    return (
        <div style={{color: 'white'}}><i className="fa fa-spinner fa-spin" style={{color: 'white'}}></i> {label ? label : "Loading..."}</div>
    );
}