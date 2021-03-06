import React, { useEffect, useState, useContext } from 'react';
import styles from '../../style/FavoriteItem.module.css';
import Loading from '../layout/Loading';
import { Link } from 'react-router-dom';
import FavoriteContext from '../../context/favorite/favoriteContext';
import AlertContext from '../../context/alert/alertContext';
import Recommendation from './Recommendation';

const MovieItem = ({favorite, movie, loading, movieCreditCrew, movieCreditCast, recommendations, languagesName }) => {
    const favoriteContext = useContext(FavoriteContext);
    const alertContext = useContext(AlertContext);

    // pull function and state out of the context
    const { deleteFavorite, addFavorite, getFavorite } = favoriteContext;
    const { setAlert } = alertContext;

    // creation of a component state 
    const [inFavorite, setInFavorite] = useState(false);

    // pull key out of the movie state object
    const { 
        id, 
        genres, 
        production_companies, 
        production_countries, 
        spoken_languages,
        backdrop_path,
        belongs_to_collection,
        budget,
        revenue,
        imdb_id,
        original_language,
        original_title,
        overview,
        poster_path,
        release_date,
        runtime,
        status,
        title,
        vote_average } = movie;


    // function for delete from the favorite list the movie if the movie be inside the list
    const onDelete = e => {
        e.preventDefault();
        if(favorite !== null) {
            favorite.map(item => {
                if(item.id === id) {
                    deleteFavorite(item._id);
                    setInFavorite(false);
                    setAlert(`Le film : ${item.title} a été enlevé de votre liste de favoris`, 'warning');
                }
            });
        }
    };

    // function for add to the favorite list the movie
    const addMovieToFavorite = e => {
        e.preventDefault();
        addFavorite(movie);
        setInFavorite(true);
        setAlert(`Le film : ${title} a été ajouté de votre liste de favoris`, 'success');
    };

    // useEffect for watch if the movie be inside the favorite list
    // if be inside so setInFavorite to true else set to false
    // watch for any change into the movie Id, inFavorite state and favorite list
    useEffect(() => {
        getFavorite();
        if(favorite !== null) {
            for(let i = 0; i < favorite.length; i++) {
                if(id === favorite[i].id) {
                    setInFavorite(true);
                    break;
                } else {
                    setInFavorite(false);
                }
            }    
        }
        // eslint-disable-next-line
    }, [id, inFavorite, favorite]);
        
        
    /* Get only the Year of the movie is or will be released */
    const year = () => {
        if(release_date !== undefined) {
            return release_date.slice(0, 4);
        }
        return release_date;
    };

    /* change vote_average into % */
    let voteAverage = vote_average*10;

    /* Get the offset for the chart */
    const offset = () => {
        let float = vote_average / 10;

        return parseInt(339.292 * (1 - float));
    };

    /* Refactoring the date element into a readable date */
    const refactDate = () => {
        if(release_date !== undefined) {
            let month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

            let retrieveDay = release_date.substring(8, 10);
            let retrieveMonth = release_date.substring(5, 7);
            let retrieveYear =  release_date.substring(0, 4);

            let newDate = `${retrieveDay} ${month[parseInt(retrieveMonth) - 1]} ${retrieveYear}`;

            return newDate;
        }
    };

    /* Refactoring runtime into Hour */
    const refactRuntime = () => {
        let hours = (runtime / 60);
        let roundHours = Math.floor(hours);
        let minutes = ( hours  - roundHours ) * 60;
        let roundMinutes = Math.round(minutes);

        if (roundMinutes < 10) {
            return `${roundHours}h 0${roundMinutes} (${runtime}min)`;
        } else {
            return `${roundHours}h ${roundMinutes} (${runtime}min)`; 
        }
    };

    /* Refactoring budget into readable Budget */
    const refactBudget = item => {
        let newArr = ('' + item).split('').map(function (digit) { 
            return digit;
        });
        if (newArr.length > 6 && newArr.length < 8) {
            return `${newArr[0]},${newArr[1]}${newArr[2]}${newArr[3]},${newArr[4]}${newArr[5]}${newArr[6]}`;
        } else if (newArr.length > 7 && newArr.length < 9) {
            return `${newArr[0]}${newArr[1]},${newArr[2]}${newArr[3]}${newArr[4]},${newArr[5]}${newArr[6]}${newArr[7]}`;
        } else if (newArr.length > 8 && newArr.length < 10) {
            return `${newArr[0]}${newArr[1]}${newArr[2]},${newArr[3]}${newArr[4]}${newArr[5]},${newArr[6]}${newArr[7]}${newArr[8]}`;
        } else if (newArr.length > 9 && newArr.length < 11) {
            return `${newArr[0]},${newArr[1]}${newArr[2]}${newArr[3]},${newArr[4]}${newArr[5]}${newArr[6]},${newArr[7]}${newArr[8]}${newArr[9]}`;
        }
        return newArr[0];
    }

    if(loading) {
        return <Loading />
    } else {
        return (
            <div className="container">
                <div className={styles.movieHeader} style={{backgroundImage: `url(https://image.tmdb.org/t/p/original${backdrop_path})`}}>
                    <img className={styles.poster} src={`https://image.tmdb.org/t/p/original${poster_path}`} alt={title}/>
                    <div className={styles.movieMainInfos}>
                        <h1>{title} <span>({loading === false ? year() : null})</span></h1>
                        <div className={styles.infos}>
                            <div className={styles.score}>
                                <div className={styles.scoreContnainer}>
                                    <div className={styles.scoreOuterRing}>
                                        <div className={styles.userScoreChart}>
                                            <div className={styles.percent}>
                                                <svg width="68" height="68" viewBox="0 0 120 120">
                                                    <circle className={styles.outerCircle} cx="60" cy="60" r="54" fill="none" strokeWidth="13" />
                                                    <circle className={styles.innerCircle} cx="60" cy="60" r="54" fill="none" strokeWidth="8" 
                                                    strokeDasharray="339.292" strokeDashoffset={`${offset()}`} />
                                                </svg>
                                            </div>
                                            <p className={styles.scoreText}>{voteAverage}<span>%</span></p>
                                        </div>
                                    </div>
                                </div>
                                <p className={styles.sText}>Note<br/> des utilisateurs</p>
                            </div>
                            <div>
                                {inFavorite === true ? <button className={styles.likeIcon} onClick={onDelete}><i className="fas fa-heart"></i></button> : <button className={styles.likeIcon_unliked} onClick={addMovieToFavorite}><i className="far fa-heart"></i></button>}
                            </div>
                            <p className={styles.watchTrailer}><i className="fas fa-play"></i> Regarder le trailer</p>
                        </div>
                        <div className={styles.overview}>
                            <h2>Synopsis</h2>
                            <p>{overview}</p>
                        </div>
                        <div className={styles.technique}>
                            <h2>Equipe technique en vedette</h2>
                            <ul className={styles.crewList}>
                                {movieCreditCrew.length > 0 ? movieCreditCrew.map(crewMember => (crewMember !== undefined ? <li key={crewMember.credit_id}><Link to={`/staffAndActors/${crewMember.id}`}><h3>{crewMember.name}</h3><p>{crewMember.job}</p></Link></li> : null)) : null }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.mainContentAndAside}>
                    <div className={styles.mainContent}>
                        <div className={styles.Actors}>
                            <div className={styles.castListContainer}>
                                <h2>Tête d'affiche</h2>
                                <ul className={styles.castList}>
                                    {movieCreditCast.length > 0 ? movieCreditCast.map(castMember => 
                                        (castMember !== undefined ?<li key={castMember.id} className={styles.card}>
                                            <Link to={`/staffAndActors/${castMember.id}`}>
                                                <img src={`https://image.tmdb.org/t/p/original${castMember.profile_path}`} alt={castMember.name} />
                                                <h3>{castMember.name}</h3><p>{castMember.character}</p>
                                            </Link>
                                        </li> : null)) : null }    
                                </ul>
                                
                            </div>
                        </div>
                        {loading === false && belongs_to_collection !== undefined && belongs_to_collection !== null ? <div className={styles.collection} style={{backgroundImage: `url(https://image.tmdb.org/t/p/original${belongs_to_collection.poster_path})`}}>
                            <h2>Fait partie de : {belongs_to_collection.name}</h2>
                            <Link to={`/collection/${belongs_to_collection.id}`}>Voir la collection</Link>
                        </div> : null}
                        {recommendations.length > 0 ? <div className={styles.recommendation}>
                            <h2>Recommendation</h2>
                            <ul className={styles.recomContainer}>
                                    {recommendations.map(recommendation => (
                                        <Recommendation recommendation={recommendation} key={recommendation.id} />
                                    ))}
                            </ul>
                        </div> : null}
                    </div>
                    <aside className={styles.aside}>
                        <h2 className={styles.asideTitle}>Informations</h2>
                        <div className={styles.asideContent}>
                            <div>
                                <h2>Titre original</h2>
                                <p>{original_title}</p>
                            </div>
                            <div>
                                <h2>Compagnies de production</h2>
                                <ul>
                                    {production_companies !== undefined ?production_companies.map(company => (
                                        <li key={company.id}><img src={`https://image.tmdb.org/t/p/w185${company.logo_path}`} alt={company.name} /></li>
                                    )) : null}
                                </ul>
                            </div>
                            <div>
                                <h2>Pays de production</h2>
                                <ul>
                                    {production_countries !== undefined ? production_countries.map(country => (
                                        <li key={country.iso_3166_1}> - {country.name}</li>
                                    )) : null}
                                </ul>
                            </div>
                            <div>
                                <h2>Status</h2>
                                {status === "Released" ?  <p>Sorti</p> : <p>A venir</p>}
                            </div>
                            <div>
                                <h2>Informations sur la sortie</h2>
                                <p>{loading === false ? refactDate() : null} au cinéma</p>
                            </div>
                            <div>
                                <h2>Langue originale</h2>
                                {languagesName != null ? languagesName.map(item => (
                                    item.iso_639_1 === original_language ? <p key={item.name}>{item.name} ({item.english_name})</p> : null
                                )) : null}
                            </div>
                            <div>
                                <h2>Durée</h2>
                                <p>{loading === false ? refactRuntime() : null}</p>
                            </div>
                            <div>
                                <h2>Budget</h2>
                                <p>${loading === false ? refactBudget(budget) : null}</p>
                            </div>
                            {revenue === undefined ? null : 
                            <div>
                                <h2>Recette</h2>
                                <p>${loading === false ? refactBudget(revenue) : null}</p>
                            </div>}
                            <div className={styles.genres}>
                                <h2>Genres</h2>
                                <ul>
                                    {genres !== undefined ? genres.map(genre => (
                                        <li key={genre.id}><Link to={`/genre/${genre.id}`} className="badge badge-light">{genre.name}</Link></li>
                                    )) : null}
                                </ul>
                            </div>
                            <div>
                                <h2>Langue parler</h2>
                                <ul>
                                    {spoken_languages !== undefined ? spoken_languages.map(language => (
                                        languagesName != null ? languagesName.map(item => (
                                        item.iso_639_1 === language.iso_639_1 ? <li key={language}>{item.name} ({item.english_name})</li> : null
                                        )) : null
                                    )) : null}
                                </ul>
                            </div>
                            <div>
                                <h2>ImDB Id</h2>
                                <p className="badge badge-warning">{imdb_id}</p>
                            </div>    
                        </div>
                        
                    </aside>
                </div>
            </div>
        ) 
    }
}

export default MovieItem
