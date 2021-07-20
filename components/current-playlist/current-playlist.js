import styles from './styles.module.css';

const CurrentPlaylist = ({playlist}) =>

    <div className={styles.currentPlaylistWrapper}>
        <div className={styles.currentPlaylistRow}>
            <div className={styles.currentPlaylistColumnImage}>
                <img
                    src={playlist.img || 'images/playlist-default.png'}
                    alt=""
                    className={styles.currentPlaylistImage}
                />
            </div>
            <div className={styles.currentPlaylistColumnInfo}>
                <h1 className={styles.currentPlaylistText}>{playlist.name}</h1>
                <p className={styles.currentPlaylistArtist}>By <a href="https://hicetnunc.xyz">{playlist.curator}</a>
                </p>
                <p className={styles.currentPlaylistDescription}>{playlist.description}</p>
            </div>
        </div>
    </div>
;

export default CurrentPlaylist;