import TrackList from '../track-lists/track-list';
import useRadio from '../../hooks/use-radio';
import { useEffect } from 'react';
import usePlaylist from '../../hooks/use-playlist';
import { audio } from '../../constants';


const AllTracksView = ({objkt, tracks}) => {
    const {
        playerState,
        controls,
        isTrackPlaying,
    } = useRadio();

    const {filteredTracks, setFilteredTracks } = usePlaylist();

    if(audio) {
        audio.onended = () => {
            if(!filteredTracks.length) return;
            const nextTrackKey = (playerState.currentTrackKey + 1) % filteredTracks.length;
            controls.selectTrack(filteredTracks)(nextTrackKey)();
        };
    }
    useEffect(() => {    
        setFilteredTracks(tracks);   
        // eslint-disable-next-line react-hooks/exhaustive-deps   
    }, [])

    useEffect(() => {
        if(playerState.currentTrack === null) {
            const foundIndex = filteredTracks.findIndex(t => t.id === Number(objkt));
            controls.initialiseTrack(filteredTracks)(foundIndex !== -1 ? foundIndex : 0)();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredTracks]);

    if(!filteredTracks) return <p>Loading...</p>;

    return (
        <TrackList
            tracks={filteredTracks}
            setTracks={setFilteredTracks}
            isTrackPlaying={isTrackPlaying}
        />
    );
};

export default AllTracksView;


