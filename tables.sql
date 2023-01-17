create table users(
    id MEDIUMINT UNSIGNED not null auto_increment,
    username VARCHAR(50) not null,
    hashed_password VARCHAR(255) not null,
    share_calendar_user_id_string LONGTEXT default '',
    primary key (id)
);

create table events(
    id INT UNSIGNED not null auto_increment,
    title VARCHAR(255) not null,
    dateAndTime datetime not null,
    holder_id MEDIUMINT UNSIGNED not null,
    isImportant enum('yes','no') not null default 'no',
    other_member_user_id_string LONGTEXT default '',
    primary key (id),
    foreign key (holder_id) references users (id)
);

