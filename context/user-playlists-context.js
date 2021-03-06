import { createContext, useEffect, useState } from 'react';
import setLocalStorage from '../utilities/set-local-storage';

export const UserPlaylistsContext = createContext();

const UserPlaylistProvider = ({children}) => {
    const [userPlaylists, setUserPlaylists] = useState([]);

    useEffect(() => {
        const storedPlaylist = window.localStorage.getItem('user-playlists');
        if(!storedPlaylist) return;
        const playlists = JSON.parse(storedPlaylist)
            .filter(sp => sp.name)
            .map(sp => sp.tags ? {...sp, tags: []} : sp);
        setLocalStorage('user-playlists', playlists);
        setUserPlaylists(playlists);
    }, []);

    const createUserPlaylist = (name) => {
        setUserPlaylists(prevState => setLocalStorage('user-playlists', [
            ...prevState,
            {
                name,
                curator: 'Mine',
                description: '',
                tracks: [],
            },
        ]));
    };

    const addTrack = (playlistName, track) => {
        setUserPlaylists(prevState => {
            const nextPlaylists = [];
            while(prevState.length) {
                const playlist = prevState.shift();
                nextPlaylists.push(playlist);
                if(playlist.name === playlistName) {
                    playlist.tracks.push(track);
                    break;
                }
            }
            return setLocalStorage('user-playlists', [...nextPlaylists, ...prevState]);
        });
    };

    const removeTrack = (playlistName, track) => {
        setUserPlaylists(prevState => {
            const nextPlaylists = [];
            while(prevState.length) {
                const playlist = prevState.shift();
                nextPlaylists.push(playlist);
                if(playlist.name === playlistName) {
                    playlist.tracks = playlist.tracks.filter(t => t.title !== track.title);
                    break;
                }
            }
            return setLocalStorage('user-playlists', [...nextPlaylists, ...prevState]);
        });
    };

    return (
        <UserPlaylistsContext.Provider
            value={{
                userPlaylists,
                createUserPlaylist,
                addTrack,
                removeTrack,
            }}
        >
            {children}
        </UserPlaylistsContext.Provider>
    );
};

export default UserPlaylistProvider;

