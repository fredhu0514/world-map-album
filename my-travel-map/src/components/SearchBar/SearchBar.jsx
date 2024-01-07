// SearchBar.jsx
import React, { useState } from 'react';
import styles from './SearchBar.module.css';

export const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('searchTerm: ', searchTerm);
        onSearch(searchTerm);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.searchForm}>
            <input
                type="text"
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search location"
            />
            <button type="submit" className={styles.searchButton}>Search</button>
        </form>
    );
};
