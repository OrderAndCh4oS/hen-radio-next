import TrackList from '../track-lists/track-list';
import useRadio from '../../hooks/use-radio';
import { useEffect } from 'react';
import usePlaylist from '../../hooks/use-playlist';
import { audio } from '../../constants';
import styles from './styles.module.css';
import { getTrimmedWallet } from '../../utilities/general';

const ObjktView = ({walletAddress, objkt, tracks}) => {
    const {
        playerState,
        controls,
        isTrackPlaying,
    } = useRadio();

    const {setTracks} = usePlaylist();

    if(audio) {
        audio.onended = () => {
            if(!tracks.length) return;
            const nextTrackKey = (playerState.currentTrackKey + 1) % tracks.length;
            controls.selectTrack(tracks)(nextTrackKey)();
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

    if(!tracks) return <p>Loading...</p>;

    return (
        <>
            <h2 className={styles.subTitle}>Tracks by {getTrimmedWallet(
                walletAddress)} {playerState.currentTrack?.creator?.name || ''}</h2>
            <TrackList
                tracks={tracks}
                isTrackPlaying={isTrackPlaying}
            />
        </>
    );
};

export default ObjktView;


