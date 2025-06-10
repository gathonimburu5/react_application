import React from "react";
const SearchComponent = ({serchTerm, setSearchTerm}) => {
    return (
        <div className="search">
            <div className="mt-[20px]">
                <input
                className="search-input"
                type="text" placeholder="search for movie" value={serchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            </div>
        </div>
    );
};
export default SearchComponent