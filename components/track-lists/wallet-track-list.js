import { useEffect, useState } from 'react';
import TrackList from './track-list';
import FilterTypes from '../../enums/filter-types';
import TracksFilterBar from './tracks-filter-bar';
import useRadio from '../../hooks/use-radio';
import usePlaylist from '../../hooks/use-playlist';
import { audio, ipfsUrls } from '../../constants';
import useWallet from '../../hooks/use-wallet';

const WalletTrackList = ({walletAddress, tracks, objkt}) => {
    const {
        playerState,
        controls,
        isTrackPlaying,
    } = useRadio();
    const {setTracks, creatorMetadata} = usePlaylist();
    const [filteredTracks, setFilteredTracks] = useState([]);
    const [filter, setFilter] = useState(FilterTypes.ALL);

    if(audio) {
        audio.onended = () => {
            if(!filteredTracks.length) return;
            const nextTrackKey = (playerState.currentTrackKey + 1) % filteredTracks.length;
            controls.initialiseTrack(walletFilterTracks)(nextTrackKey)();
        };
    }

    useEffect(() => {
        setTracks(tracks);
        if(playerState.currentTrack === null) {
            const foundIndex = tracks.findIndex(t => t.id === Number(objkt));
            controls.initialiseTrack(tracks)(foundIndex !== -1 ? foundIndex : 0)();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tracks]);

    useEffect(() => {
        if(!filteredTracks) return;
        setWalletFilterTracks(filteredTracks.filter(t => {
            switch(filter) {
                case FilterTypes.ALL:
                    return true;
                case FilterTypes.CREATIONS:
                    return t.creator === walletAddress;
                case FilterTypes.COLLECTIONS:
                    return t.creator !== walletAddress;
                default:
                    return true;
            }
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredTracks, filter]);

    if(!filteredTracks) return <p>Loading...</p>;

    return (
        <>
            <TracksFilterBar filter={filter} setFilter={setFilter}/>
            <TrackList
                tracks={walletFilterTracks}
                isTrackPlaying={isTrackPlaying}
                creatorMetadata={creatorMetadata}
            />
        </>
    );
};

export default WalletTrackList;
