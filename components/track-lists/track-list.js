import styles from './styles.module.css';
import PauseIcon from '../icons/pause-icon';
import PlayIcon from '../icons/play-icon';
import AddToPlaylist from '../add-to-playlist/add-to-playlist';
import RemoveFromPlaylist from '../add-to-playlist/remove-from-playlist';
import useRadio from '../../hooks/use-radio';
import LoadingIcon from '../icons/loading-icon';
import Image from 'next/image';
import TrackLinks from './track-links';
import FilterButtons from '../radio-player/buttons/filter-buttons';
import { useRouter } from 'next/router';
import getAllTracks from '../../api/get-all-tracks';
import { getIpfsUrl } from '../../utilities/general';

const TrackList = ({
    tracks,
    setTracks,
    isTrackPlaying,
    playlist,
}) => {
    const {controls, playerState} = useRadio();
    const handleSelectTrack = controls.selectTrack(tracks);
    const tags= ['jazz', 'rock', 'glitch','noise','ambient','saxophone','chill','beats','guitar','drums','soundscape','piano','peaceful','live','hardcore','funk','bass','dark','brazil','poetry','rap','hiphop','electro'];

    const page = useRouter().pathname;

    const renderPlayPauseButton = (id, i) => {
        if(playerState.isLoading) return (
            <span className={`${styles.icon_loading_small} ${styles.playerControlIcon_small}`}>
                <LoadingIcon/>
            </span>
        );
        return isTrackPlaying(id)
            ? (
                <button
                    className={`${styles.button} ${styles.button_pause_small} ${styles.playerControlIcon_small}`}
                    onClick={controls.pause}
                ><PauseIcon/></button>
            ) : (
                <button
                    className={`${styles.button} ${styles.button_play_small} ${styles.playerControlIcon_small}`}
                    onClick={handleSelectTrack(i)}
                ><PlayIcon/></button>
            );
    };

    const filterTracks = async(tag) => {
        const allTracks = await getAllTracks();
        const filteredTracks = allTracks.filter(track => track.tags?.some((tags) => { return tags.tag.tag === tag})) 
        setTracks(filteredTracks);
    }

    return <>
        {!tracks.length ? <p>No audio tracks available</p> : (
            <div>
                {page === "/" && <FilterButtons tags={tags} filter={filterTracks} /> }
                {page === "/" && <hr className={styles.divider}/>}

                {tracks.map((t, i) =>
                    <div key={t.id} className={styles.trackRow}>
                        {renderPlayPauseButton(t.id, i)}
                        {
                            playlist?.curator === 'Mine'
                                ? <RemoveFromPlaylist
                                    playlistName={playlist.name}
                                    track={t}
                                />
                                : <AddToPlaylist track={t}/>
                        }
                        <TrackLinks
                            track={t}
                            walletAddress={t.creator.walletAddress}
                            name={t.creator.name}
                        />
                        <div className={styles.trackRow_avatar}>
                            <Image
                                width={26}
                                height={26}
                                alt={'Artist\'s avatar'}
                                src={t.displayUri
                                    ? getIpfsUrl(t.displayUri)
                                    : '/images/playlist-default.png'}
                            />
                        </div>
                    </div>,
                )}
            </div>
        )}
    </>;
};

export default TrackList;
