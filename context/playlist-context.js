import { createContext, useState } from 'react';

export const PlaylistContext = createContext();

const PlaylistProvider = ({children}) => {
    const [filteredTracks, setFilteredTracks] = useState([]);

    return (
        <PlaylistContext.Provider
            value={{
                filteredTracks,
                setFilteredTracks,
            }}
        >
            {children}
        </PlaylistContext.Provider>
    );
};

export default PlaylistProvider;

