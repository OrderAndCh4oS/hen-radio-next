import { createContext, useEffect, useState } from 'react';
import getUserMetadataByWalletId from '../api/get-user-metadata-by-wallet-id';

export const PlaylistContext = createContext();

const PlaylistProvider = ({children}) => {
    const [filteredTracks, setFilteredTracks] = useState([]);
    const [creatorMetadata, setCreatorMetadata] = useState({});

    useEffect(() => {
        console.log(filteredTracks)
        if(!filteredTracks) return;
        (async() => {
            const uniqueCreatorWalletIds = new Set(filteredTracks.map(t => t.creator));
            const nextCreatorMetadata = (await Promise.allSettled(
                [...uniqueCreatorWalletIds]
                    .map(id => getUserMetadataByWalletId(id)),
            ))
                .filter(res => res.status === 'fulfilled')
                .reduce((obj, res) => {
                    try {
                        const walletId = /\/(tz.*?)\//.exec(res.value.config.url)[1];
                        obj[walletId] = res.value.data;
                    } catch(e) {
                        // Do Nothing
                    }
                    return obj;
                }, {});
            setCreatorMetadata(nextCreatorMetadata);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredTracks]);

    return (
        <PlaylistContext.Provider
            value={{
                filteredTracks,
                setFilteredTracks,
                creatorMetadata
            }}
        >
            {children}
        </PlaylistContext.Provider>
    );
};

export default PlaylistProvider;

