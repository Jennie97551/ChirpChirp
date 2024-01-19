create table post(
    text text not null,
    time timestamp default CURRENT_TIMESTAMP,
    likes int not null,
    user varchar(20) not null,
    id int auto_increment,
    PRIMARY KEY (id),
    FOREIGN KEY (user)
        REFERENCES account(username)
);

create table account(
    username varchar(20) not null,
    password varchar(20) not null,
    PRIMARY KEY (username)
);

insert into account (username, password) values ('myUsername123', 'password');

insert into post (text, likes, user) values ('Somebody once told me the world was gonna roll me, i took a bite out of a tree. It tasted kinda funny so I spit it at a bunny and the bunny spit it back at me', 0, 'myUsername123');