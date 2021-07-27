import { useEffect, useState } from 'react';
import TrackList from './track-list';
import FilterTypes from '../../enums/filter-types';
import WalletFilterBar from './wallet-filter-bar';
import useRadio from '../../hooks/use-radio';
import usePlaylist from '../../hooks/use-playlist';
import { audio } from '../../constants';

const WalletTrackList = ({walletAddress, tracks, objkt}) => {
    const {
        playerState,
        controls,
        isTrackPlaying,
    } = useRadio();
    const {setFilteredTracks} = usePlaylist();
    const [walletFilteredTracks, setWalletFilteredTracks] = useState([]);
    const [filter, setFilter] = useState(FilterTypes.ALL);

    if(audio) {
        audio.onended = () => {
            if(!walletFilteredTracks.length) return;
            const nextTrackKey = (playerState.currentTrackKey + 1) % walletFilteredTracks.length;
            controls.initialiseTrack(walletFilteredTracks)(nextTrackKey)();
        };
    }

    useEffect(() => {
        setWalletFilteredTracks(tracks);
        if(playerState.currentTrack === null) {
            const foundIndex = tracks.findIndex(t => t.id === Number(objkt));
            controls.initialiseTrack(tracks)(foundIndex !== -1 ? foundIndex : 0)();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tracks]);

    useEffect(() => {
        if(!tracks) return;
        setWalletFilteredTracks(tracks.filter(t => {
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
    }, [tracks, filter]);

    if(!tracks) return <p>Loading...</p>;

    return (
        <>
            <WalletFilterBar filter={filter} setFilter={setFilter}/>
            <TrackList
                tracks={walletFilteredTracks}
                isTrackPlaying={isTrackPlaying}
            />
        </>
    );
};

export default WalletTrackList;