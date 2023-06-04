
import "./main.css";
export default function UserInfo({ user }) {
    const createdAtDate = new Date(user.created_at).toLocaleDateString();

    return (
        <div id="user-info-cont">
            <section id="banner"></section>
                <img id="hero" src={user.photo_url}></img>
            <section id="gray-zone">
                <div id="user-info">
                    <span id="user-name-info">
                        <h2>{user.username}</h2>
                        <h2 id="code">#{user.code}</h2>
                    </span>
                    <span id="user-info-spacer"></span>
                    <span>
                        <p>DISCORD MEMBER SINCE</p>
                        <p id="code">{createdAtDate}</p>
                    </span>
                    <span id="user-info-spacer"></span>
                    <span>ABOUT ME</span>
                    <p>{user.about}</p>
                </div>
            </section>
        </div>
    )
}
