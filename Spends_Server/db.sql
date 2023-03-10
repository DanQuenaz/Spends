DROP DATABASE DB_SPENDING_TOGETHER;

CREATE DATABASE DB_SPENDING_TOGETHER;

USE DB_SPENDING_TOGETHER;

CREATE TABLE TB_USERS(
    USER_ID INT NOT NULL AUTO_INCREMENT,
    NAME VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255) NOT NULL,
    NICKNAME VARCHAR(255) NOT NULL,
    PASSWORD VARCHAR(511) NOT NULL,
    ACCOUNT_TYPE INT NOT NULL,
    ACCOUNT_VALIDATE INT NOT NULL,
    ACCOUNT_CODE_VALIDATE VARCHAR(255) NOT NULL,

    PRIMARY KEY (USER_ID)
);

CREATE TABLE TB_SPREAD_SHEETS(
    SPREAD_SHEET_ID INT NOT NULL AUTO_INCREMENT,
    OWNER_ID INT NOT NULL,
    NAME VARCHAR(255) NOT NULL,
    INVITE_CODE VARCHAR(255) NOT NULL,
    CREATION_DATE DATETIME NOT NULL,

    PRIMARY KEY (SPREAD_SHEET_ID),
    FOREIGN KEY (OWNER_ID) REFERENCES TB_USERS (USER_ID) ON DELETE CASCADE
);

CREATE TABLE TB_USERS_SHEETS(
    LINK_ID INT NOT NULL AUTO_INCREMENT,
    USER_ID INT NOT NULL,
    SPREAD_SHEET_ID INT NOT NULL,

    PRIMARY KEY (LINK_ID),
    FOREIGN KEY (USER_ID) REFERENCES TB_USERS (USER_ID),
    FOREIGN KEY (SPREAD_SHEET_ID) REFERENCES TB_SPREAD_SHEETS (SPREAD_SHEET_ID) ON DELETE CASCADE
    
);

CREATE TABLE TB_TAGS(
    TAG_ID INT NOT NULL AUTO_INCREMENT,
    OWNER_ID INT NOT NULL,
    NAME VARCHAR(127) NOT NULL,
    DEFAULT_TAG INT NOT NULL,

    PRIMARY KEY (TAG_ID),
    FOREIGN KEY (OWNER_ID) REFERENCES TB_USERS (USER_ID) ON DELETE CASCADE
);

CREATE TABLE TB_SPENDS(
    SPEND_ID INT NOT NULL AUTO_INCREMENT,
    INSTALLMENT_ID INT NULL,
    OWNER_ID INT NOT NULL,
    SPREAD_SHEET_ID INT NOT NULL,
    TAG_ID INT NOT NULL,
    DESCRIPTION VARCHAR(511) NOT NULL,
    INSTALLMENT_DESCRIPTION VARCHAR(255) NOT NULL,
    VALUE FLOAT NOT NULL,
    TOTAL_VALUE FLOAT NOT NULL,
    INITIAL_DATE DATETIME NOT NULL,
    DATE DATETIME NOT NULL,
    TOTAL_INSTALLMENTS INT NOT NULL,
    CLOSED INT NOT NULL,
    FIXED INT NOT NULL,


    PRIMARY KEY (SPEND_ID),
    FOREIGN KEY (INSTALLMENT_ID) REFERENCES TB_SPENDS (SPEND_ID) ON DELETE CASCADE,
    FOREIGN KEY (OWNER_ID) REFERENCES TB_USERS (USER_ID) ON DELETE CASCADE,
    FOREIGN KEY (SPREAD_SHEET_ID) REFERENCES TB_SPREAD_SHEETS(SPREAD_SHEET_ID) ON DELETE CASCADE,
    FOREIGN KEY (TAG_ID) REFERENCES TB_TAGS (TAG_ID)

);

CREATE VIEW v_totais_planilhas AS select TB_SPENDS.SPREAD_SHEET_ID AS SPREAD_SHEET_ID
,sum(TB_SPENDS.VALUE) AS TOTAL_VALUE 
from TB_SPENDS 
group by TB_SPENDS.SPREAD_SHEET_ID;

INSERT INTO TB_TAGS
(OWNER_ID, NAME, DEFAULT_TAG)
VALUES (1, 'Casa', 1), (1, 'Supermercado', 1), (1, 'Lazer', 1), (1, 'Contas', 1), (1, 'Financiamentos', 1);

