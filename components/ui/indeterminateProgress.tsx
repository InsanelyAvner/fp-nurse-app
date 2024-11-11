import React from 'react';

const IndeterminateProgressBar: React.FC = () => {
    return (
        <div className="progress">
            <div className="indeterminate"></div>
            <style jsx>{`.progress{position:absolute;height:3px;display:block;width:100%;background-color:#9d22351a;border-radius:2px;background-clip:padding-box;margin:0 0 1rem 0;overflow:hidden}.indeterminate{background-color:#9d2235}.indeterminate:before{content:'';position:absolute;background-color:inherit;top:0;left:0;bottom:0;will-change:left,right;animation:indeterminate 2.1s cubic-bezier(.65,.815,.735,.395) infinite}.indeterminate:after{content:'';position:absolute;background-color:inherit;top:0;left:0;bottom:0;will-change:left,right;animation:indeterminate-short 2.1s cubic-bezier(.165,.84,.44,1) infinite;animation-delay:1.15s}@keyframes indeterminate{0%{left:-35%;right:100%}60%{left:100%;right:-90%}100%{left:100%;right:-90%}}@keyframes indeterminate-short{0%{left:-200%;right:100%}60%{left:107%;right:-8%}100%{left:107%;right:-8%}}`}</style>
        </div>
    );
};

export default IndeterminateProgressBar;
