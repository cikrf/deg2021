#include <stdio.h>
#include "gosthash2012.h"
#include <stdlib.h>
#include <time.h>

#include <string.h>

#include <openssl/bio.h> /* BasicInput/Output streams */
#include <openssl/err.h> /* errors */
#include <openssl/ssl.h> /* core library */
#include <openssl/ec.h>
#include <openssl/rand.h>

#include <ctype.h>

#include "CSP_WinCrypt.h"
#include "CSP_WinDef.h"
#include "WinCryptEx.h"

#define GF_LEN 32

#define PUB_BLOB_EXPORT_HEADER_LEN 37
#define PUB_BLOB_EXPORT_LEN (PUB_BLOB_EXPORT_HEADER_LEN + 64)
#define PUB_BLOB_EXPORT_COMPRESSED_LEN (PUB_BLOB_EXPORT_HEADER_LEN + 32 + 1)


void print_time() {
    time_t t = time(NULL);
    struct tm tm = *localtime(&t);
    printf("now: %d-%02d-%02d %02d:%02d:%02d\n", tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min,
           tm.tm_sec);
}

int IsOdd(const unsigned char *pA, unsigned int len) {
    int err = 0;

    if (pA[len - 1] & 0x01)
        return 1;

    return err;
}


int getFlag(const unsigned char *P) {
    if (P[0] == 0x02) {
        return 0;
    } else if (P[0] == 0x03) {
        return 1;
    } else {
        return -1;
    }
}

void reverseBytes(void *start, int size) {
    unsigned char *lo = (unsigned char *) start;
    unsigned char *hi = (unsigned char *) start + size - 1;
    unsigned char swap;
    while (lo < hi) {
        swap = *lo;
        *lo++ = *hi;
        *hi-- = swap;
    }
}

HCRYPTPROV hProv;
BOOL hProvAcquired = FALSE;

int initContexts() {
    int err = 1;
    if (!hProvAcquired) {
        hProvAcquired = TRUE;
        const char *oid = szOID_tc26_gost_3410_12_256_paramSetB;

        err = CryptAcquireContext(&hProv, NULL, NULL, PROV_GOST_2012_256, CRYPT_VERIFYCONTEXT);
        if (err != 1)
            return 0;


        err = CryptSetProvParam(hProv, PP_DHOID, (BYTE *) oid, 0);
        if (err != 1)
            return 0;
    }
}


void report_and_exit(const char *msg) {
    perror(msg);
    ERR_print_errors_fp(stderr);
    exit(-1);
}

void init_ssl() {
    SSL_load_error_strings();
    SSL_library_init();
}

void cleanup(SSL_CTX *ctx, BIO *bio) {
    SSL_CTX_free(ctx);
    BIO_free_all(bio);
}

/*
SEQUENCE {
     166 06    7:   OBJECT IDENTIFIER
                :    id-GostR3410-2001-CryptoPro-A-ParamSet
     175 30  147:   SEQUENCE {
     178 02   33:    INTEGER
                :     00 FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF
                :     FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FD
                :     94
     213 02    2:    INTEGER 166
     217 02   33:    INTEGER
                :     00 FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF
                :     FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF FD
                :     97
     252 02   33:    INTEGER
                :     00 FF FF FF FF FF FF FF FF FF FF FF FF FF FF FF
                :     FF 6C 61 10 70 99 5A D1 00 45 84 1B 09 B7 61 B8
                :     93
     287 02    1:    INTEGER 1
     290 02   33:    INTEGER
                :     00 8D 91 E4 71 E0 98 9C DA 27 DF 50 5A 45 3F 2B
                :     76 35 29 4F 2D DF 23 E3 B1 22 AC C9 9C 9E 9F 1E
                :     14
                :    }
                :   }
*/



const unsigned char cryptoProBase[GF_LEN * 2] = {
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x01, 0x8d, 0x91, 0xe4, 0x71, 0xe0, 0x98, 0x9c, 0xda, 0x27, 0xdf,
        0x50, 0x5a, 0x45, 0x3f, 0x2b, 0x76, 0x35, 0x29, 0x4f, 0x2d, 0xdf, 0x23, 0xe3, 0xb1,
        0x22, 0xac, 0xc9, 0x9c, 0x9e, 0x9f, 0x1e, 0x14
};

const unsigned char cryptoProBaseCompressed[GF_LEN + 1] = {
        0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x01
};

//const unsigned char cryptoProBase[GF_LEN * 2] = {
//
//        0x9B, 0x1B, 0xFD, 0xDF, 0x8A, 0x85, 0x5F, 0x79, 0x73, 0xB5, 0xD3, 0x61, 0x94, 0xCB, 0xCE, 0x17,
//        0x53, 0x6D, 0x50, 0x37, 0xB1, 0x2D, 0x15, 0x78, 0x19, 0x01, 0x30, 0x7A, 0x0E, 0x83, 0x3F, 0x06,
//        0x4F, 0x7F, 0x0E, 0xE2, 0x8B, 0xAF, 0xEA, 0x70, 0x0E, 0x01, 0xF3, 0xA5, 0x7C, 0xA0, 0x51, 0x87,
//        0xEC, 0xD9, 0xDB, 0x76, 0x9B, 0xAE, 0xAC, 0x8D, 0x05, 0xCA, 0x08, 0xAC, 0xDA, 0x51, 0x46, 0x03,
//};

//const unsigned char cryptoProBaseLE[GF_LEN * 2] = {
//        0x01, 0x00, 0x00, 0x00,
//        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
//        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
//        0x14, 0x1e, 0x9f, 0x9e, 0x9c, 0xc9, 0xac, 0x22, 0xb1, 0xe3, 0x23, 0xdf, 0x2d, 0x4f, 0x29, 0x35, 0x76, 0x2b,
//        0x3f, 0x45, 0x5a, 0x50, 0xdf, 0x27, 0xda, 0x9c, 0x98, 0xe0, 0x71, 0xe4, 0x91, 0x8d,
//};

const unsigned char a_bin[GF_LEN] =
        {
                0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
                0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFD, 0x94,
        };

const unsigned char b_bin[] = {0xA6};

const unsigned char p_bin[GF_LEN] =
        {
                0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
                0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFD, 0x97,
        };

const unsigned char order_bin[GF_LEN] =
        {
                0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
                0x6C, 0x61, 0x10, 0x70, 0x99, 0x5A, 0xD1, 0x00, 0x45, 0x84, 0x1B, 0x09, 0xB7, 0x61, 0xB8, 0x93
        };

const unsigned char x_bin[] = {0x01};

const unsigned char y_bin[GF_LEN] =
        {
                0x8D, 0x91, 0xE4, 0x71, 0xE0, 0x98, 0x9C, 0xDA, 0x27, 0xDF, 0x50, 0x5A, 0x45, 0x3F, 0x2B, 0x76,
                0x35, 0x29, 0x4F, 0x2D, 0xDF, 0x23, 0xE3, 0xB1, 0x22, 0xAC, 0xC9, 0x9C, 0x9E, 0x9F, 0x1E, 0x14
        };


void PrintBN(const BIGNUM *bn) {
    unsigned char cipher[512];
    strcpy((char *) cipher, BN_bn2hex(bn));
    strcat((char *) cipher, "\n");
    printf("%s", cipher);
}

void PrintPoint(const EC_GROUP *curve, const EC_POINT *pPoint) {
    BIGNUM *x = BN_new();
    BIGNUM *y = BN_new();

    if (EC_POINT_get_affine_coordinates_GFp(curve, pPoint, x, y, NULL)) {
        BN_print_fp(stdout, x);
        putc('\n', stdout);
        BN_print_fp(stdout, y);
        putc('\n', stdout);
    }

    BN_free(x);
    BN_free(y);
}

void PrintPointCompressed(const EC_GROUP *curve, const EC_POINT *pPoint) {
    BIGNUM *x = BN_new();
    BIGNUM *y = BN_new();
    char *pszPoint = NULL;
    BN_CTX *ctx;

    /* Set up the BN_CTX */
    if (NULL == (ctx = BN_CTX_new()))
        return;

    pszPoint = EC_POINT_point2hex(curve, pPoint, POINT_CONVERSION_COMPRESSED, ctx);
    printf("\nCompressed form: %s\n", pszPoint);

    BN_free(x);
    BN_free(y);
    BN_CTX_free(ctx);
    OPENSSL_free(pszPoint);
}

char *toLower(char *str, size_t len) {
    char *str_l = calloc(len + 1, sizeof(char));

    for (size_t i = 0; i < len; ++i) {
        str_l[i] = tolower((unsigned char) str[i]);
    }
    return str_l;
}

int Point2HexCompressed(const EC_GROUP *curve, const EC_POINT *pPoint, char *psz_Point) {
    BIGNUM *x = BN_new();
    BIGNUM *y = BN_new();
    char *pszPoint = NULL;
    BN_CTX *ctx;
    int err = 1;

    /* Set up the BN_CTX */
    if (NULL == (ctx = BN_CTX_new())) {
        err = 0;
        goto exit;
    }


    pszPoint = EC_POINT_point2hex(curve, pPoint, POINT_CONVERSION_COMPRESSED, ctx);
    pszPoint = toLower(pszPoint, strlen(pszPoint));

    if (!pszPoint) {
        err = 0;
        goto exit;
    }
    strcpy(psz_Point, pszPoint);

    exit:
    BN_free(x);
    BN_free(y);
    BN_CTX_free(ctx);
    OPENSSL_free(pszPoint);

    return err;
}

void toHex(unsigned char *in, size_t insz, unsigned char *out, size_t outsz) {
    unsigned char *pin = in;
    const char *hex = "0123456789abcdef";
    unsigned char *pout = out;
    for (; pin < in + insz; pout += 2, pin++) {
        pout[0] = hex[(*pin >> 4) & 0xF];
        pout[1] = hex[*pin & 0xF];
        if (pout + 2 - out > outsz) {
            /* Better to truncate output string than overflow buffer */
            /* it would be still better to either return a status */
            /* or ensure the target buffer is large enough and it never happen */
            break;
        }
    }
//    pout[-1] = 0;
}


void PrintBuff(const unsigned char *pBuff, unsigned int uiLen) {
    unsigned int i;
    char szStr[25] = "";
    char szStrResult[8 * 4096] = "";

    printf("\n{");

    for (i = 0; i < uiLen; i++) {
        if ((i) % 16)
            sprintf(szStr, "0x%.2X, ", pBuff[i]);
        else
            sprintf(szStr, "\n0x%.2X, ", pBuff[i]);

        strcat(szStrResult, szStr);
    }
    printf("%s", szStrResult);
    printf("};\n");
}

void PointToBin(const EC_GROUP *curve, const EC_POINT *pPoint, unsigned char *p_Point) {
    BIGNUM *x = BN_new();
    BIGNUM *y = BN_new();

    if (EC_POINT_get_affine_coordinates_GFp(curve, pPoint, x, y, NULL)) {
        BN_bn2binpad(x, p_Point, GF_LEN);
        BN_bn2binpad(y, p_Point + GF_LEN, GF_LEN);
    }

    BN_free(x);
    BN_free(y);
}

int EC_POINT2binBE(const EC_GROUP *pCurve, const EC_POINT *pPoint, unsigned char *p_Point) {
    BN_CTX *ctx;
    int err;

    BIGNUM *bn_X, *bn_Y;

    /* Set up the BN_CTX */
    if (NULL == (ctx = BN_CTX_new()))
        return 0;

    bn_X = BN_new();
    bn_Y = BN_new();

    err = EC_POINT_is_on_curve(pCurve, pPoint, ctx);
    if (err != 1)
        goto exit;

    err = EC_POINT_get_affine_coordinates_GFp(pCurve, pPoint, bn_X, bn_Y, ctx);
    if (err != 1)
        goto exit;

    BN_bn2binpad(bn_X, p_Point, GF_LEN);
    BN_bn2binpad(bn_Y, p_Point + GF_LEN, GF_LEN);

    exit:
    BN_free(bn_X);
    BN_free(bn_Y);

    BN_CTX_free(ctx);

    return 1;
}

int EC_POINT2binBECompressed(const EC_GROUP *pCurve, const EC_POINT *pPoint, unsigned char *p_PointX,
                             unsigned char *p_flag) {

    int err = 1;

    BIGNUM *bn_X, *bn_Y;

    bn_X = BN_new();
    bn_Y = BN_new();

    err = EC_POINT_is_on_curve(pCurve, pPoint, NULL);
    if (err != 1)
        return err;

    err = EC_POINT_get_affine_coordinates_GFp(pCurve, pPoint, bn_X, bn_Y, NULL);
    if (err != 1) {
        BN_free(bn_X);
        BN_free(bn_X);
        return err;
    }

    BN_bn2binpad(bn_X, p_PointX, GF_LEN);

    if (BN_is_odd(bn_Y))
        *p_flag = 1;
    else
        *p_flag = 0;

    BN_free(bn_X);
    BN_free(bn_Y);

    return 1;
}

int binBE2EC_POINT(const EC_GROUP *pCurve, const unsigned char *p_Point, EC_POINT *pPoint) {
    int err = 1;

    BIGNUM *bn_X, *bn_Y;


    if (NULL == (bn_X = BN_bin2bn(p_Point, GF_LEN, NULL)))
        goto exit;

    if (NULL == (bn_Y = BN_bin2bn(p_Point + GF_LEN, GF_LEN, NULL)))
        goto exit;


    err = EC_POINT_set_affine_coordinates_GFp(pCurve, pPoint, bn_X, bn_Y, NULL);
    if (err != 1) {
        goto exit;
    }

    exit:
    BN_free(bn_X);
    BN_free(bn_Y);

    return err;
}

int binBE2EC_POINTCompressed(const EC_GROUP *pCurve, const unsigned char *p_X, unsigned char flag, EC_POINT *pPoint) {
    int err = 1;

    BIGNUM *bn_X;


    if (NULL == (bn_X = BN_bin2bn(p_X, GF_LEN, NULL)))
        goto exit;


    err = EC_POINT_set_compressed_coordinates_GFp(pCurve, pPoint, bn_X, flag, NULL);
    if (err != 1) {
        goto exit;
    }


    exit:
    BN_free(bn_X);

    return err;
}

void reverseCoords(unsigned char *point) {
    unsigned char t;
    for (int i = 0; i < 16; i++) {
        t = point[i];
        point[i] = point[GF_LEN - 1 - i];
        point[GF_LEN - 1 - i] = t;
        t = point[GF_LEN + i];
        point[GF_LEN + i] = point[2 * GF_LEN - 1 - i];
        point[2 * GF_LEN - 1 - i] = t;
    }
}


EC_GROUP *create_curve(void) {
    BN_CTX *ctx;
    EC_GROUP *curve;
    BIGNUM *a, *b, *p, *order, *x, *y;
    EC_POINT *generator;

    /* Set up the BN_CTX */
    if (NULL == (ctx = BN_CTX_new())) return 0;

    /* Set the values for the various parameters */


    if (NULL == (a = BN_bin2bn(a_bin, sizeof(a_bin), NULL))) return 0;
    if (NULL == (b = BN_bin2bn(b_bin, sizeof(b_bin), NULL))) return 0;
    if (NULL == (p = BN_bin2bn(p_bin, sizeof(p_bin), NULL))) return 0;
    if (NULL == (order = BN_bin2bn(order_bin, sizeof(order_bin), NULL))) return 0;
    if (NULL == (x = BN_bin2bn(x_bin, sizeof(x_bin), NULL))) return 0;
    if (NULL == (y = BN_bin2bn(y_bin, sizeof(y_bin), NULL))) return 0;

/*
    PrintBN(a);
    PrintBN(b);
    PrintBN(p);
    PrintBN(order);
    PrintBN(x);
    PrintBN(y);
*/
    /* Create the curve */
    if (NULL == (curve = EC_GROUP_new_curve_GFp(p, a, b, ctx))) return 0;

    /* Create the generator */
    if (NULL == (generator = EC_POINT_new(curve)))
        return 0;

    if (1 != EC_POINT_set_affine_coordinates_GFp(curve, generator, x, y, ctx))
        return 0;

    /* Set the generator and the order */
    if (1 != EC_GROUP_set_generator(curve, generator, order, NULL))
        return 0;

/////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////


    EC_POINT_free(generator);
    BN_free(y);
    BN_free(x);
    BN_free(order);
    BN_free(p);
    BN_free(b);
    BN_free(a);
    BN_CTX_free(ctx);

    return curve;
}


int CryptoProScalarMultEx(const unsigned char *p_Num, const unsigned char *p_Point,
                          unsigned char *p_ResultPoint) {
    BOOL bOK;
    HCRYPTKEY hKey;

    unsigned char pPubKeyBlob[
            29 + GF_LEN * 2] = {0x06, 0x20, 0x00, 0x00, 0x49, 0x2E, 0x00, 0x00, 0x4D, 0x41, 0x47, 0x31, 0x00, 0x02,
                                0x00, 0x00, 0x30, 0x0B, 0x06, 0x09, 0x2A, 0x85, 0x03, 0x07, 0x01, 0x02, 0x01, 0x01,
                                0x02,};

    unsigned char pbKeyBlob[29 + GF_LEN * 2];

    unsigned char p_Num_LE[GF_LEN];
    memcpy(p_Num_LE, p_Num, GF_LEN);
    reverseBytes(p_Num_LE, GF_LEN);

    unsigned char p_Point_LE[GF_LEN * 2];
    memcpy(p_Point_LE, p_Point, GF_LEN * 2);
    reverseCoords(p_Point_LE);

    // Зададим множитель m как байтовую строку в LE
    BYTE bNum[32];
    CRYPT_DATA_BLOB cdbNum = {0x20, bNum};

    DWORD dwBlobLen = 29 + GF_LEN * 2;

    memcpy(cdbNum.pbData, p_Num_LE, GF_LEN);

    memcpy(pPubKeyBlob + 29, p_Point_LE, GF_LEN * 2);


    bOK = CryptImportKey(hProv, pPubKeyBlob, sizeof(pPubKeyBlob), NULL, PUBLICKEYBLOB, &hKey);
    if (!bOK)
        return FALSE;

    // Получим в hKey ( (m * sk) mod q, m * pk)
    bOK = CryptSetKeyParam(hKey, KP_MULX, (BYTE *) &cdbNum, 0);
    if (!bOK)
        return FALSE;

    //--------------------------------------------------------------------
    // Экспортирование открытого ключа получателя в BLOB открытого ключа.

    if (!CryptExportKey(
            hKey,
            0,
            PUBLICKEYBLOB,
            0,
            pbKeyBlob,
            &dwBlobLen)) {
        return FALSE;
    }

    memcpy(p_ResultPoint, pbKeyBlob + 29, GF_LEN * 2);
    reverseCoords(p_ResultPoint);
    /////////////////////////////////////////////////////////////////////////////////////

    // освобождаем память
    bOK = CryptDestroyKey(hKey);
    if (!bOK)
        return 0;

    return 1;
}

// each output buffer must have len >= 65 bytes !
int generate_pair(char *pPrivKey, char *pPubX, char *pPubY) {
    int err = 1;
    BN_CTX *ctx;
    BIGNUM *bn_priv, *bn_rnd, *bn_q, *bn_X, *bn_Y;
    unsigned char rnd_buffer[GF_LEN];
    EC_GROUP *curve;
    EC_POINT *PubKey;

    curve = create_curve();
    if (NULL == curve)
        return 0;

    ctx = BN_CTX_new();

    bn_priv = BN_new();
    bn_rnd = BN_new();
    bn_q = BN_new();
    bn_X = BN_new();
    bn_Y = BN_new();

    ctx = BN_CTX_new();

    RAND_bytes(rnd_buffer, GF_LEN);

    BN_bin2bn(rnd_buffer, GF_LEN, bn_rnd);

    EC_GROUP_get_order(curve, bn_q, ctx);
    BN_mod(bn_priv, bn_rnd, bn_q, ctx);

    strcpy(pPrivKey, BN_bn2hex(bn_priv));

    PubKey = EC_POINT_new(curve);

    // PubKey = bn_priv*Base
    err = EC_POINT_mul(curve, PubKey, bn_priv, NULL, NULL, ctx);
    if (err == 0)
        goto exit;

    err = EC_POINT_get_affine_coordinates_GFp(curve, PubKey, bn_X, bn_Y, ctx);
    if (err == 0)
        goto exit;

    strcpy(pPubX, BN_bn2hex(bn_X));
    strcpy(pPubY, BN_bn2hex(bn_Y));

    exit:
    EC_POINT_free(PubKey);
    BN_free(bn_priv);
    BN_free(bn_rnd);
    BN_free(bn_q);
    BN_free(bn_X);
    BN_free(bn_Y);
    BN_CTX_free(ctx);

    EC_GROUP_free(curve);

    return err;
}

int GeneratePairCompressed(unsigned char *p_priv, unsigned char *p_Pubx, unsigned char *p_flagPub) {
    int err = 1;
    BN_CTX *ctx;
    BIGNUM *bn_priv, *bn_rnd, *bn_q;
    unsigned char rnd_buffer[GF_LEN];
    EC_GROUP *curve;
    EC_POINT *PubKey;

    curve = create_curve();
    if (NULL == curve)
        return 0;

    ctx = BN_CTX_new();

    bn_priv = BN_new();
    bn_rnd = BN_new();
    bn_q = BN_new();

    ctx = BN_CTX_new();

    RAND_bytes(rnd_buffer, GF_LEN);

    BN_bin2bn(rnd_buffer, GF_LEN, bn_rnd);

    EC_GROUP_get_order(curve, bn_q, ctx);
    BN_mod(bn_priv, bn_rnd, bn_q, ctx);

    BN_bn2binpad(bn_priv, p_priv, GF_LEN);

    PubKey = EC_POINT_new(curve);

    // PubKey = bn_priv*Base
    err = EC_POINT_mul(curve, PubKey, bn_priv, NULL, NULL, ctx);
    if (err == 0)
        goto exit;

    err = EC_POINT2binBECompressed(curve, PubKey, p_Pubx, p_flagPub);
    if (err != 1)
        goto exit;


    exit:
    EC_POINT_free(PubKey);
    BN_free(bn_priv);
    BN_free(bn_rnd);
    BN_free(bn_q);

    BN_CTX_free(ctx);

    EC_GROUP_free(curve);

    return err;
}

int generatePair(unsigned char *privateKey, unsigned char *publicKey) {
    unsigned char flagPub;
    int err = 1;

    err = GeneratePairCompressed(privateKey, publicKey, &flagPub);
    if (err != 1)
        goto exit;


    for (unsigned int i = GF_LEN; i > 0; i--) {
        publicKey[i] = publicKey[i - 1];
    }

    if (flagPub == 0) {
        publicKey[0] = 0x02;
    } else {
        publicKey[0] = 0x03;
    }

    exit:
    return err;
}



// generates random r < q

int GenRndInField(const BIGNUM *pbn_q, BIGNUM *pbn_r) {
    int err = 1;
    unsigned char rnd_buffer[GF_LEN] = {
            0x76, 0x1B, 0xE3, 0x6F, 0x2C, 0x50, 0x94, 0x49, 0x6C, 0x89, 0x59, 0x98, 0x69, 0x8A, 0xD5, 0x73,
            0x94, 0xFF, 0xF4, 0xBC, 0xD6, 0x59, 0xAD, 0x42, 0xF2, 0x62, 0x72, 0x01, 0x66, 0x00, 0x55, 0x7E,};
    BIGNUM *pbn_rnd;
    BN_CTX *ctx;

//    err = RAND_bytes(rnd_buffer, GF_LEN);
//    if (err != 1)
//        return err;

    ctx = BN_CTX_new();

    pbn_rnd = BN_new();

    BN_bin2bn(rnd_buffer, GF_LEN, pbn_rnd);

    BN_mod(pbn_r, pbn_rnd, pbn_q, ctx);

    BN_free(pbn_rnd);
    BN_CTX_free(ctx);

    return err;
}

int GenRndInFieldParamsetA(unsigned char *p_r) {
    int err = 1;
    unsigned char rnd_buffer[GF_LEN] = {
            0x76, 0x1B, 0xE3, 0x6F, 0x2C, 0x50, 0x94, 0x49, 0x6C, 0x89, 0x59, 0x98, 0x69, 0x8A, 0xD5, 0x73,
            0x94, 0xFF, 0xF4, 0xBC, 0xD6, 0x59, 0xAD, 0x42, 0xF2, 0x62, 0x72, 0x01, 0x66, 0x00, 0x55, 0x7E,};
    BIGNUM *pbn_rnd, *pbn_r, *pbn_q;
    BN_CTX *ctx;

//    err = RAND_bytes(rnd_buffer, GF_LEN);
//    if (err != 1)
//        return err;

    ctx = BN_CTX_new();

    pbn_rnd = BN_new();
    pbn_r = BN_new();
    pbn_q = BN_bin2bn(order_bin, sizeof(order_bin), NULL);

    BN_bin2bn(rnd_buffer, GF_LEN, pbn_rnd);

    BN_mod(pbn_r, pbn_rnd, pbn_q, ctx);

    BN_bn2binpad(pbn_r, p_r, GF_LEN);

    BN_free(pbn_rnd);
    BN_free(pbn_r);
    BN_CTX_free(ctx);

    return err;
}


// hashes array of numOfPoints points
// x and y coordinate are in big-endian and always have lenhth of curve field (for example, for 256-bit field:
// if the most significant byte of x or y coordinate is zero, the coordinate will occupy 32 bytes (but not 31) : first byte must be zero)

int HashPointsBE(const EC_GROUP *pCurve, EC_POINT *ppPoint[], size_t numOfPoints, unsigned char *pHash) {

    int err = 1;

    gost2012_hash_ctx gost_ctx;

    init_gost2012_hash_ctx(&gost_ctx, 256);

    for (size_t i = 0; i < numOfPoints; i++) {
        BIGNUM *bn_X, *bn_Y;
        BN_CTX *ctx;
        unsigned char p_X[GF_LEN];
        unsigned char p_Y[GF_LEN];

        bn_X = BN_new();
        bn_Y = BN_new();
        ctx = BN_CTX_new();

        err = EC_POINT_is_on_curve(pCurve, ppPoint[i], ctx);
        if (err != 1)
            return err;

        err = EC_POINT_get_affine_coordinates_GFp(pCurve, ppPoint[i], bn_X, bn_Y, ctx);
        if (err != 1) {
            BN_free(bn_X);
            BN_free(bn_X);
            BN_CTX_free(ctx);
            return err;
        }

        BN_bn2binpad(bn_X, p_X, GF_LEN);
        BN_bn2binpad(bn_Y, p_Y, GF_LEN);

        gost2012_hash_block(&gost_ctx, p_X, GF_LEN);
        gost2012_hash_block(&gost_ctx, p_Y, GF_LEN);

        BN_free(bn_X);
        BN_free(bn_Y);
        BN_CTX_free(ctx);

    }

    gost2012_finish_hash(&gost_ctx, pHash);

    return 1;
}

// make proof that Y1 = x*G1 and Y2 = x*G2
// returns 1 if proof is done

int ProveEqualityOfDL(const EC_GROUP *pCurve,
                      const BIGNUM *pbn_x,
                      EC_POINT *pG1,
                      EC_POINT *pY1,
                      EC_POINT *pG2,
                      EC_POINT *pY2,
                      BIGNUM *pbn_w,
                      EC_POINT *pU1,
                      EC_POINT *pU2) {
    int err = 1;
    BN_CTX *ctx;
    BIGNUM *pbn_u, *pbn_q, *pbn_hash, *pbn_x_mult_hash;
    EC_POINT *pp_Points[] = {pU1, pU2, pG1, pY1, pG2, pY2};
    unsigned char pHash[GF_LEN];

    pbn_u = BN_new();
    pbn_q = BN_new();
    pbn_hash = BN_new();
    pbn_x_mult_hash = BN_new();
    ctx = BN_CTX_new();


    err = EC_GROUP_get_order(pCurve, pbn_q, ctx);
    if (err != 1)
        goto exit;


    err = GenRndInField(pbn_q, pbn_u);
    if (err != 1)
        goto exit;


    err = EC_POINT_mul(pCurve, pU1, NULL, pG1, pbn_u, ctx);
    if (err != 1)
        goto exit;


    err = EC_POINT_mul(pCurve, pU2, NULL, pG2, pbn_u, ctx);
    if (err != 1)
        goto exit;


    err = HashPointsBE(pCurve, pp_Points, sizeof(pp_Points) / sizeof(pp_Points[0]), pHash);
    if (err == 0)
        goto exit;


    BN_bin2bn(pHash, GF_LEN, pbn_hash);

    // w = x*hash + u  mod q :

    err = BN_mod_mul(pbn_x_mult_hash, pbn_x, pbn_hash, pbn_q, ctx);
    if (err == 0)
        goto exit;

    err = BN_mod_add(pbn_w, pbn_x_mult_hash, pbn_u, pbn_q, ctx);
    if (err == 0)
        goto exit;


    exit:
    BN_free(pbn_x_mult_hash);
    BN_free(pbn_hash);
    BN_free(pbn_q);
    BN_free(pbn_u);
    BN_CTX_free(ctx);

    return err;
}

// calc B = x*A

int PointMultParamsetA(
        const unsigned char *p_x,
        const unsigned char *p_A,
        unsigned char *p_B) {
    int err = 1;
    EC_GROUP *pCurve = NULL;

    BN_CTX *ctx;

    BIGNUM *pbn_x = NULL;
    EC_POINT *pA = NULL;
    EC_POINT *pB = NULL;

    ctx = BN_CTX_new();

    pCurve = create_curve();

    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }

    pbn_x = BN_new();
    pB = EC_POINT_new(pCurve);

    BN_bin2bn(p_x, GF_LEN, pbn_x);


    if (p_A != NULL) {

        pA = EC_POINT_new(pCurve);

        binBE2EC_POINT(pCurve, p_A, pA);

        err = EC_POINT_is_on_curve(pCurve, pA, NULL);
        if (err != 1)
            return err;

        err = EC_POINT_mul(pCurve, pB, NULL, pA, pbn_x, ctx);
    } else
        err = EC_POINT_mul(pCurve, pB, pbn_x, NULL, NULL, ctx);

    if (err != 1)
        goto exit;
    //printf("\n ---------------------------\n");
    //PrintPoint(pCurve, pB);
    //PrintPointCompressed(pCurve, pB);


    PointToBin(pCurve, pB, p_B);


    exit:
    BN_free(pbn_x);
    EC_GROUP_free(pCurve);
    BN_CTX_free(ctx);
    EC_POINT_free(pB);

    if (pA)
        EC_POINT_free(pA);
    return err;
}


// calc B = x*A

int PointMultParamsetACompressed(
        const unsigned char *p_x,
        const unsigned char *p_AXcoord,
        const unsigned char flagA,
        unsigned char *p_BXcoord,
        unsigned char *p_flagB) {
    int err = 1;
    EC_GROUP *pCurve = NULL;

    BN_CTX *ctx;

    BIGNUM *pbn_x = NULL;
    EC_POINT *pA = NULL;
    EC_POINT *pB = NULL;

    ctx = BN_CTX_new();

    pCurve = create_curve();

    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }

    pbn_x = BN_new();
    pB = EC_POINT_new(pCurve);

    BN_bin2bn(p_x, GF_LEN, pbn_x);


    if (p_AXcoord != NULL) {

        pA = EC_POINT_new(pCurve);

        err = binBE2EC_POINTCompressed(pCurve, p_AXcoord, flagA, pA);
        if (err != 1)
            goto exit;

        err = EC_POINT_is_on_curve(pCurve, pA, NULL);
        if (err != 1)
            goto exit;

        err = EC_POINT_mul(pCurve, pB, NULL, pA, pbn_x, ctx);
    } else
        err = EC_POINT_mul(pCurve, pB, pbn_x, NULL, NULL, ctx);

    if (err != 1)
        goto exit;

    err = EC_POINT2binBECompressed(pCurve, pB, p_BXcoord, p_flagB);
    if (err != 1)
        goto exit;

    exit:
    BN_free(pbn_x);
    EC_GROUP_free(pCurve);
    BN_CTX_free(ctx);
    EC_POINT_free(pB);

    if (pA)
        EC_POINT_free(pA);

    return err;
}


int ProveEqualityOfDLParamsetA(
        const unsigned char *p_x,
        const unsigned char *p_G1,
        const unsigned char *p_Y1,
        const unsigned char *p_G2,
        const unsigned char *p_Y2,
        unsigned char *p_w,
        unsigned char *p_U1,
        unsigned char *p_U2) {
    int err = 1;
    EC_GROUP *pCurve = NULL;

    BIGNUM *pbn_x = NULL;
    EC_POINT *pG1 = NULL;
    EC_POINT *pY1 = NULL;
    EC_POINT *pG2 = NULL;
    EC_POINT *pY2 = NULL;

    EC_POINT *pU1 = NULL;
    EC_POINT *pU2 = NULL;
    BIGNUM *pbn_w = NULL;

    pCurve = create_curve();

    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }

    pbn_x = BN_new();
    pU1 = EC_POINT_new(pCurve);
    pU2 = EC_POINT_new(pCurve);
    pG1 = EC_POINT_new(pCurve);
    pY1 = EC_POINT_new(pCurve);
    pG2 = EC_POINT_new(pCurve);
    pY2 = EC_POINT_new(pCurve);
    pbn_w = BN_new();

    BN_bin2bn(p_x, GF_LEN, pbn_x);
    binBE2EC_POINT(pCurve, p_G1, pG1);
    binBE2EC_POINT(pCurve, p_Y1, pY1);
    binBE2EC_POINT(pCurve, p_G2, pG2);
    binBE2EC_POINT(pCurve, p_Y2, pY2);


    err = ProveEqualityOfDL(pCurve,
                            pbn_x,
                            pG1,
                            pY1,
                            pG2,
                            pY2,
                            pbn_w,
                            pU1,
                            pU2);

    if (err != 0) {

        BN_bn2binpad(pbn_w, p_w, GF_LEN);
        EC_POINT2binBE(pCurve, pU1, p_U1);
        EC_POINT2binBE(pCurve, pU2, p_U2);
    }


    exit:
    BN_free(pbn_x);
    BN_free(pbn_w);

    EC_POINT_free(pG1);
    EC_POINT_free(pY1);
    EC_POINT_free(pG2);
    EC_POINT_free(pY2);
    EC_POINT_free(pU1);
    EC_POINT_free(pU2);

    EC_GROUP_free(pCurve);
    return err;
}

int ProveEqualityOfDLCompressed(
        const unsigned char *p_x,
        const unsigned char *p_G1x, unsigned char flagG1,
        const unsigned char *p_Y1x, unsigned char flagY1,
        const unsigned char *p_G2x, unsigned char flagG2,
        const unsigned char *p_Y2x, unsigned char flagY2,
        unsigned char *p_w,
        unsigned char *p_U1x, unsigned char *p_flagU1,
        unsigned char *p_U2x, unsigned char *p_flagU2) {
    int err = 1;
    EC_GROUP *pCurve = NULL;

    BIGNUM *pbn_x = NULL;
    EC_POINT *pG1 = NULL;
    EC_POINT *pY1 = NULL;
    EC_POINT *pG2 = NULL;
    EC_POINT *pY2 = NULL;

    EC_POINT *pU1 = NULL;
    EC_POINT *pU2 = NULL;
    BIGNUM *pbn_w = NULL;

    pCurve = create_curve();

    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }

    pbn_x = BN_new();
    pU1 = EC_POINT_new(pCurve);
    pU2 = EC_POINT_new(pCurve);
    pG1 = EC_POINT_new(pCurve);
    pY1 = EC_POINT_new(pCurve);
    pG2 = EC_POINT_new(pCurve);
    pY2 = EC_POINT_new(pCurve);
    pbn_w = BN_new();

    BN_bin2bn(p_x, GF_LEN, pbn_x);

    err = binBE2EC_POINTCompressed(pCurve, p_G1x, flagG1, pG1);
    if (err != 1)
        goto exit;

    err = binBE2EC_POINTCompressed(pCurve, p_Y1x, flagY1, pY1);
    if (err != 1)
        goto exit;

    err = binBE2EC_POINTCompressed(pCurve, p_G2x, flagG2, pG2);
    if (err != 1)
        goto exit;

    err = binBE2EC_POINTCompressed(pCurve, p_Y2x, flagY2, pY2);
    if (err != 1)
        goto exit;

    err = ProveEqualityOfDL(pCurve,
                            pbn_x,
                            pG1,
                            pY1,
                            pG2,
                            pY2,
                            pbn_w,
                            pU1,
                            pU2);

    if (err != 0) {
        BN_bn2binpad(pbn_w, p_w, GF_LEN);
        EC_POINT2binBECompressed(pCurve, pU1, p_U1x, p_flagU1);
        EC_POINT2binBECompressed(pCurve, pU2, p_U2x, p_flagU2);
    }


    exit:
    BN_free(pbn_x);
    BN_free(pbn_w);

    EC_POINT_free(pG1);
    EC_POINT_free(pY1);
    EC_POINT_free(pG2);
    EC_POINT_free(pY2);
    EC_POINT_free(pU1);
    EC_POINT_free(pU2);

    EC_GROUP_free(pCurve);
    return err;
}


const unsigned char pMsg2Hash[] = {

        0xbe, 0x69, 0xed, 0x82, 0xe1, 0xa5, 0x2c, 0x2c, 0x13, 0x15, 0x23, 0xd0, 0x13, 0x2e, 0x3b, 0x0d, 0xf0, 0x9a,
        0x07, 0x7f, 0x4d, 0xe6, 0x54, 0xca, 0xd8, 0xd8, 0xeb, 0x26, 0x6c, 0x28, 0x14, 0x6a,

        0x07, 0x12, 0x5e, 0xb6, 0xb3, 0x8f, 0xb2, 0xb9, 0xd7, 0x41, 0xb0, 0x46, 0x4d, 0x6b, 0xce, 0xcd, 0xa5, 0xeb,
        0x4b, 0x04, 0x46, 0xf6, 0xc7, 0x7c, 0x5e, 0xc4, 0xec, 0xce, 0xd6, 0x74, 0xd0, 0x98,

        0xd2, 0xa8, 0x41, 0x3a, 0x72, 0x2c, 0x99, 0x75, 0x21, 0xfc, 0xc1, 0x9b, 0xd3, 0x97, 0x8f, 0x32, 0x4a, 0x00,
        0x23, 0x7f, 0x16, 0xed, 0xe8, 0xe9, 0xac, 0xf3, 0x99, 0xc6, 0x1d, 0x0f, 0xfd, 0xf3,

        0xf7, 0x1c, 0xb1, 0x29, 0xab, 0xd6, 0xd8, 0xdb, 0xee, 0xdc, 0x92, 0x71, 0xd5, 0xba, 0x92, 0x38, 0x17, 0x9b,
        0x79, 0xcd, 0x86, 0x77, 0x6d, 0xe4, 0x0e, 0x9b, 0xf2, 0x91, 0xda, 0xf9, 0x2c, 0x77,

        0x88, 0xb1, 0xa7, 0x79, 0x09, 0x58, 0x75, 0x3f, 0xdc, 0xb0, 0xe1, 0xb0, 0x23, 0xc8, 0x1b, 0x1a, 0xa4, 0xd4,
        0x0f, 0xa8, 0xeb, 0x14, 0x11, 0x1d, 0xbc, 0xad, 0x49, 0x35, 0xd4, 0x4f, 0x7e, 0x8e,

        0xd0, 0x78, 0xa7, 0x78, 0xa9, 0x0b, 0x18, 0x56, 0xc0, 0xbf, 0x6c, 0x08, 0x4b, 0xa9, 0x65, 0xd4, 0xce, 0xf9,
        0xb6, 0xd9, 0x14, 0xa4, 0xfe, 0xfc, 0x8e, 0x90, 0xd7, 0x37, 0xf3, 0x5c, 0xcb, 0xce,

        72, 101, 108, 108, 111, 33
};

const unsigned char pCorrectHash[32] = {
        0x23, 0xE0, 0x46, 0x57, 0x8D, 0xA9, 0x0F, 0x7F, 0xEA, 0xD1, 0xA9, 0x34, 0x24, 0x90, 0x10, 0x64, 0x9C, 0x34,
        0xEE, 0x67, 0xCC, 0xB9, 0xA0, 0x85, 0x4D, 0x1F, 0x9D, 0xBB, 0xD0, 0x85, 0x20, 0x54,
};


void stribog256(const unsigned char *pData, size_t len, unsigned char *pHash) {
    gost2012_hash_ctx gost_ctx;

    init_gost2012_hash_ctx(&gost_ctx, 256);

    gost2012_hash_block(&gost_ctx, pData, len);

    gost2012_finish_hash(&gost_ctx, pHash);
}

int test_stribog256() {
    unsigned char pHash[32];

    stribog256(pMsg2Hash, sizeof(pMsg2Hash), pHash);

    if (memcmp(pHash, pCorrectHash, 32)) {
        //printf("Hash is incorrect !\n");
        return 0;
    }

    return 1;
}

// C = A + B:
int AddPointsParamsetA(const unsigned char *p_A,
                       const unsigned char *p_B,
                       unsigned char *p_C) {
    int err = 1;
    EC_GROUP *pCurve;
    EC_POINT *pA, *pB, *pC;

    pCurve = create_curve();

    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }

    pA = EC_POINT_new(pCurve);
    pB = EC_POINT_new(pCurve);
    pC = EC_POINT_new(pCurve);

    binBE2EC_POINT(pCurve, p_A, pA);
    binBE2EC_POINT(pCurve, p_B, pB);

    err = EC_POINT_add(pCurve, pC, pA, pB, NULL);
    if (err != 1)
        goto exit;

    EC_POINT2binBE(pCurve, pC, p_C);


    exit:
    EC_POINT_free(pA);
    EC_POINT_free(pB);
    EC_POINT_free(pC);

    EC_GROUP_free(pCurve);

    return err;
}

// C = A + B:
int AddPointsCompressed(const unsigned char *p_Ax, unsigned char flagA,
                        const unsigned char *p_Bx, unsigned char flagB,
                        unsigned char *p_Cx, unsigned char *p_flagC) {
    int err = 1;
    EC_GROUP *pCurve;
    EC_POINT *pA, *pB, *pC;

    pCurve = create_curve();

    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }

    pA = EC_POINT_new(pCurve);
    pB = EC_POINT_new(pCurve);
    pC = EC_POINT_new(pCurve);

    err = binBE2EC_POINTCompressed(pCurve, p_Ax, flagA, pA);
    if (err != 1)
        goto exit;

    err = binBE2EC_POINTCompressed(pCurve, p_Bx, flagB, pA);
    if (err != 1)
        goto exit;

    err = EC_POINT_add(pCurve, pC, pA, pB, NULL);
    if (err != 1)
        goto exit;

    EC_POINT2binBECompressed(pCurve, pC, p_Cx, p_flagC);

    exit:
    EC_POINT_free(pA);
    EC_POINT_free(pB);
    EC_POINT_free(pC);

    EC_GROUP_free(pCurve);

    return err;
}

// C = A - B
int SubPointsParamsetA(const unsigned char *p_A,
                       const unsigned char *p_B,
                       unsigned char *p_C) {
    int err = 1;
    EC_GROUP *pCurve = NULL;
    EC_POINT *pB = NULL;
    unsigned char p_InvB[2 * GF_LEN];
    pCurve = create_curve();

    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }

    pB = EC_POINT_new(pCurve);
    binBE2EC_POINT(pCurve, p_B, pB);

    err = EC_POINT_invert(pCurve, pB, NULL);
    if (err != 1)
        goto exit;

    EC_POINT2binBE(pCurve, pB, p_InvB);

    err = AddPointsParamsetA(p_A, p_InvB, p_C);

    exit:
    EC_POINT_free(pB);
    EC_GROUP_free(pCurve);
    return err;
}

int SubPointsCompressed(const unsigned char *p_Ax, unsigned char flagA,
                        const unsigned char *p_Bx, unsigned char flagB,
                        unsigned char *p_Cx, unsigned char *p_flagC) {
    int err = 1;
    EC_GROUP *pCurve = NULL;
    EC_POINT *pA = NULL;
    EC_POINT *pB = NULL;
    EC_POINT *pC = NULL;
    pCurve = create_curve();

    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }

    pA = EC_POINT_new(pCurve);
    pB = EC_POINT_new(pCurve);
    pC = EC_POINT_new(pCurve);

    binBE2EC_POINTCompressed(pCurve, p_Ax, flagA, pA);
    binBE2EC_POINTCompressed(pCurve, p_Bx, flagB, pB);

    err = EC_POINT_invert(pCurve, pB, NULL);
    if (err != 1)
        goto exit;

    err = EC_POINT_add(pCurve, pC, pA, pB, NULL);
    if (err != 1)
        goto exit;

    err = EC_POINT2binBECompressed(pCurve, pC, p_Cx, p_flagC);
    if (err != 1)
        goto exit;

    exit:
    EC_POINT_free(pA);
    EC_POINT_free(pB);
    EC_POINT_free(pC);
    EC_GROUP_free(pCurve);
    return err;
}

int testAddAndSubPoints() {
    int err;
    unsigned char p_A[64];
    unsigned char p_B[64];
    unsigned char p_C[64];

    unsigned char p_correctC[64] = {
            0x6F, 0x60, 0x68, 0xFC, 0xE8, 0xE2, 0x23, 0xD6, 0x40, 0xCD, 0x78, 0x06, 0xD5, 0xE7, 0xB7, 0x96,
            0xB0, 0x7B, 0x8B, 0x8C, 0x06, 0xFB, 0x57, 0xBE, 0xD7, 0x3C, 0xD0, 0x76, 0x2B, 0x36, 0x7D, 0x91,
            0x33, 0x8C, 0xCA, 0x96, 0x78, 0x85, 0x9F, 0xE1, 0xA1, 0x2D, 0xD6, 0x05, 0x73, 0xB1, 0xA9, 0xD1,
            0xF7, 0x85, 0xF8, 0xB5, 0x25, 0x4B, 0x62, 0x35, 0x0F, 0x38, 0x9E, 0x16, 0x5A, 0x8A, 0x79, 0xBD,};

    unsigned char p_correctC1[64] = {
            0xCB, 0x92, 0x73, 0xBA, 0xA3, 0xB8, 0xF2, 0x61, 0x6B, 0x69, 0x1E, 0xB9, 0x5E, 0xB9, 0x30, 0x79,
            0xF4, 0x24, 0x43, 0x70, 0xEB, 0x0F, 0x9B, 0x3F, 0x62, 0x83, 0x30, 0x6E, 0xEA, 0x50, 0x7F, 0x8B,
            0x9C, 0xF9, 0x96, 0x9D, 0xC8, 0x6F, 0x9B, 0x94, 0x17, 0x58, 0xE7, 0x96, 0x65, 0x45, 0xC4, 0x14,
            0xC0, 0x86, 0xC1, 0x8E, 0x17, 0x78, 0x0E, 0xFB, 0x3A, 0x51, 0xE1, 0xF9, 0x06, 0x40, 0x51, 0xB5,};


    BIGNUM *pbnAX;
    BIGNUM *pbnAY;

    BIGNUM *pbnBX;
    BIGNUM *pbnBY;

    char *p_szAx = "01";
    char *p_szAy = "8D91E471E0989CDA27DF505A453F2B7635294F2DDF23E3B122ACC99C9E9F1E14";

    char *p_szBx = "aa2a9313563870c6310c650e97eea89182c97858ed8a24fb7c203c233a804174";
    char *p_szBy = "86956288cb9fb6a7e08774e96e5bf1476c29df1e9c660c654025426fe3c54dfa";

    //"0x6f6068fce8e223d640cd7806d5e7b796b07b8b8c06fb57bed73cd0762b367d91
    //"0x338cca9678859fe1a12dd60573b1a9d1f785f8b5254b62350f389e165a8a79bd

    pbnAX = BN_new();
    BN_hex2bn(&pbnAX, p_szAx);

    pbnAY = BN_new();
    BN_hex2bn(&pbnAY, p_szAy);

    pbnBX = BN_new();
    BN_hex2bn(&pbnBX, p_szBx);

    pbnBY = BN_new();
    BN_hex2bn(&pbnBY, p_szBy);

    BN_bn2binpad(pbnAX, p_A, 32);
    BN_bn2binpad(pbnAY, p_A + 32, 32);

    BN_bn2binpad(pbnBX, p_B, 32);
    BN_bn2binpad(pbnBY, p_B + 32, 32);

    err = AddPointsParamsetA(p_A,
                             p_B,
                             p_C);
    if (err != 1)
        return err;

    if (memcmp(p_C, p_correctC, 64)) {
        return 0;
    }


    err = SubPointsParamsetA(p_A,
                             p_B,
                             p_C);
    if (err != 1)
        return err;

    if (memcmp(p_C, p_correctC1, 64)) {
        return 0;
    }


    return err;
}

int
AddPublicDecrKeys(const unsigned char *pPublicKeyA, const unsigned char *pPublicKeyB, unsigned char *pMainPublicKey) {
    int err = 1;
    unsigned char pHash1[GF_LEN];
    unsigned char pHash2[GF_LEN];
    unsigned char pHash1MultPublicKeyA[2 * GF_LEN];
    unsigned char pHash2MultPublicKeyB[2 * GF_LEN];
    gost2012_hash_ctx gost_ctx;

    init_gost2012_hash_ctx(&gost_ctx, 256);

    gost2012_hash_block(&gost_ctx, pPublicKeyA, 2 * GF_LEN);
    gost2012_hash_block(&gost_ctx, pPublicKeyB, 2 * GF_LEN);

    gost2012_finish_hash(&gost_ctx, pHash1);

    gost2012_hash_block(&gost_ctx, pPublicKeyB, 2 * GF_LEN);
    gost2012_hash_block(&gost_ctx, pPublicKeyA, 2 * GF_LEN);

    gost2012_finish_hash(&gost_ctx, pHash2);

    err = PointMultParamsetA(pHash1, pPublicKeyA, pHash1MultPublicKeyA);
    if (err != 1)
        return err;

    err = PointMultParamsetA(pHash2, pPublicKeyB, pHash2MultPublicKeyB);
    if (err != 1)
        return err;

    err = AddPointsParamsetA(pHash1MultPublicKeyA,
                             pHash2MultPublicKeyB,
                             pMainPublicKey);
    if (err != 1)
        return err;

    return err;
}

BOOL validatePublicKey(const unsigned char *publicKey) {
    int err = 1;
    EC_GROUP *pCurve;
    BN_CTX *ctx;

    unsigned char pointX[GF_LEN];
    unsigned char flag;

    ctx = BN_CTX_new();

    EC_POINT *Point;

    pCurve = create_curve();
    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }

    for (unsigned int i = 0; i < GF_LEN; i++) {
        pointX[i] = publicKey[i + 1];
    }

    Point = EC_POINT_new(pCurve);

    flag = getFlag(publicKey);

    err = binBE2EC_POINTCompressed(pCurve, pointX, flag, Point);
    if (err != 1)
        goto exit;

    err = EC_POINT_is_on_curve(pCurve, Point, ctx);
    if (err != 1)
        goto exit;

    exit:
    EC_POINT_free(Point);
    EC_GROUP_free(pCurve);
    BN_CTX_free(ctx);

    if (err == 1) {
        return TRUE;
    } else {
        return FALSE;
    }
}


int mixPublicKeys(const unsigned char *PA, const unsigned char *PB, unsigned char *Result) {
    int err = 1;
    unsigned char pHash1[GF_LEN];
    unsigned char pHash2[GF_LEN];
    unsigned char p_Hash1MultPA[2 * GF_LEN];
    unsigned char p_Hash2MultPB[2 * GF_LEN];
    unsigned char p_PA_full[2 * GF_LEN];
    unsigned char p_PB_full[2 * GF_LEN];

    BIGNUM *BN_tmp = NULL;

    EC_GROUP *pCurve;
    BN_CTX *ctx;

    EC_POINT *p_PA, *p_PB, *p_Result;
    EC_POINT *p_PAMultHash1, *p_PBMultHash2;

    char pszPointCompressedA[2 + 2 * GF_LEN + 1];
    char pszPointCompressedB[2 + 2 * GF_LEN + 1];

    unsigned char flagA, flagB, flagResult;
    unsigned char PAx[32], PBx[32];


    gost2012_hash_ctx gost_ctx;

    ctx = BN_CTX_new();

    pCurve = create_curve();
    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }


    for (unsigned int i = 0; i < GF_LEN; i++) {
        PAx[i] = PA[i + 1];
    }

    for (unsigned int i = 0; i < GF_LEN; i++) {
        PBx[i] = PB[i + 1];
    }


    p_PA = EC_POINT_new(pCurve);
    p_PB = EC_POINT_new(pCurve);
    p_Result = EC_POINT_new(pCurve);

    p_PAMultHash1 = EC_POINT_new(pCurve);
    p_PBMultHash2 = EC_POINT_new(pCurve);

    flagA = getFlag(PA);
    flagB = getFlag(PB);

    err = binBE2EC_POINTCompressed(pCurve, PAx, flagA, p_PA);
    if (err != 1)
        goto exit;

    err = binBE2EC_POINTCompressed(pCurve, PBx, flagB, p_PB);
    if (err != 1)
        goto exit;

    err = Point2HexCompressed(pCurve, p_PA, pszPointCompressedA);
    if (err != 1)
        goto exit;

    err = Point2HexCompressed(pCurve, p_PB, pszPointCompressedB);
    if (err != 1)
        goto exit;

    init_gost2012_hash_ctx(&gost_ctx, 256);

    gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressedA, 2 + 2 * GF_LEN);
    gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressedB, 2 + 2 * GF_LEN);

    gost2012_finish_hash(&gost_ctx, pHash1);

    init_gost2012_hash_ctx(&gost_ctx, 256);

    gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressedB, 2 + 2 * GF_LEN);
    gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressedA, 2 + 2 * GF_LEN);

    gost2012_finish_hash(&gost_ctx, pHash2);

    BN_tmp = BN_new();
    BN_bin2bn(pHash1, GF_LEN, BN_tmp);
    err = EC_POINT_mul(pCurve, p_PAMultHash1, NULL, p_PA, BN_tmp, ctx);
    if (err != 1)
        return err;

    BN_bin2bn(pHash2, GF_LEN, BN_tmp);
    err = EC_POINT_mul(pCurve, p_PBMultHash2, NULL, p_PB, BN_tmp, ctx);
    if (err != 1)
        return err;


    err = EC_POINT_add(pCurve, p_Result, p_PAMultHash1, p_PBMultHash2, NULL);
    if (err != 1)
        return err;

    err = EC_POINT2binBECompressed(pCurve, p_Result, Result, &flagResult);
    if (err != 1)
        goto exit;

    for (unsigned int i = GF_LEN; i > 0; i--) {
        Result[i] = Result[i - 1];
    }

    if (flagResult == 0) {
        Result[0] = 0x02;
    } else {
        Result[0] = 0x03;
    }


    exit:

    BN_free(BN_tmp);

    EC_POINT_free(p_PA);
    EC_POINT_free(p_PB);
    EC_POINT_free(p_PAMultHash1);
    EC_POINT_free(p_PBMultHash2);
    EC_POINT_free(p_Result);

    EC_GROUP_free(pCurve);
    BN_CTX_free(ctx);

    return err;
}

// PublicKey = Hash(PublicKeyA,PublicKeyB) * PublicKeyA  +  Hash(PublicKeyB,PublicKeyA) * PublicKeyB

int AddPublicDecrKeysCompressed(const unsigned char *pPublicKeyAx, unsigned char flagPublicKeyA,
                                const unsigned char *pPublicKeyBx, unsigned char flagPublicKeyB,
                                unsigned char *pMainPublicKeyx, unsigned char *p_flagPublicKey) {
    int err = 1;
    unsigned char p_Hash1[GF_LEN];
    unsigned char p_Hash2[GF_LEN];
    unsigned char p_PublicKeyA[2 * GF_LEN];
    unsigned char p_PublicKeyB[2 * GF_LEN];

    unsigned char p_Hash1MultPublicKeyA[2 * GF_LEN];
    unsigned char p_Hash2MultPublicKeyB[2 * GF_LEN];

    unsigned char p_MainPublicKey[2 * GF_LEN];

    gost2012_hash_ctx gost_ctx;
    EC_GROUP *pCurve;

    EC_POINT *pPublicKeyA, *pPublicKeyB;


    pCurve = create_curve();

    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }

    pPublicKeyA = EC_POINT_new(pCurve);
    pPublicKeyB = EC_POINT_new(pCurve);

    err = binBE2EC_POINTCompressed(pCurve, pPublicKeyAx, flagPublicKeyA, pPublicKeyA);
    if (err != 1)
        goto exit;

    err = binBE2EC_POINTCompressed(pCurve, pPublicKeyBx, flagPublicKeyB, pPublicKeyB);
    if (err != 1)
        goto exit;

    err = EC_POINT2binBE(pCurve, pPublicKeyA, p_PublicKeyA);
    if (err != 1)
        goto exit;

    err = EC_POINT2binBE(pCurve, pPublicKeyB, p_PublicKeyB);
    if (err != 1)
        goto exit;

    init_gost2012_hash_ctx(&gost_ctx, 256);

    gost2012_hash_block(&gost_ctx, p_PublicKeyA, 2 * GF_LEN);
    gost2012_hash_block(&gost_ctx, p_PublicKeyB, 2 * GF_LEN);

    gost2012_finish_hash(&gost_ctx, p_Hash1);

    gost2012_hash_block(&gost_ctx, p_PublicKeyB, 2 * GF_LEN);
    gost2012_hash_block(&gost_ctx, p_PublicKeyA, 2 * GF_LEN);

    gost2012_finish_hash(&gost_ctx, p_Hash2);

    err = PointMultParamsetA(p_Hash1, p_PublicKeyA, p_Hash1MultPublicKeyA);
    if (err != 1)
        return err;

    err = PointMultParamsetA(p_Hash2, p_PublicKeyB, p_Hash2MultPublicKeyB);
    if (err != 1)
        return err;

    err = AddPointsParamsetA(p_Hash1MultPublicKeyA,
                             p_Hash2MultPublicKeyB,
                             p_MainPublicKey);
    if (err != 1)
        return err;

    memcpy(pMainPublicKeyx, p_MainPublicKey, GF_LEN);

    *p_flagPublicKey = IsOdd(p_MainPublicKey, 2 * GF_LEN);

    exit:
    return err;
}

int MakeRangeProofExParamsetA(
        unsigned int message,
        const unsigned char *p_PubKey,
        const unsigned int *p_all_messages,
        const unsigned int num_of_messages,
        const unsigned char *p_A,
        const unsigned char *p_B,
        const unsigned char *p_r,
        unsigned char *p_As,
        unsigned char *p_Bs,
        unsigned char *p_c,
        unsigned char *p_rss) {
    int err = 1;
    unsigned int iIndexOfReal;
    EC_GROUP *pCurve;

    BIGNUM *pbn_c_sum, *pbn_c_i, *pbn_rss_i, *pbn_hash, *pbn_all_messages_i, *pbn_q, *pbn_r, *pbn_rss_real, *pbn_c_real;

    EC_POINT *pPubKey, *pA, *pB, *pr_ss_iBase, *pr_ss_iPubKey, *pc_iA, *pAs_i, *pBs_i, *pAs_i_add_c_iA,
            *pall_messages_iBase, *pB_sub_all_messages_iBase, *pc_i_mult_B_sub_all_messages_iBase, *pRightSide;

    unsigned char pHash[GF_LEN];
    gost2012_hash_ctx gost_ctx;
    char pszPointCompressed[2 + 2 * GF_LEN + 1];

    BN_CTX *ctx;

    ctx = BN_CTX_new();

    pCurve = create_curve();
    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }

    pPubKey = EC_POINT_new(pCurve);
    pA = EC_POINT_new(pCurve);
    pB = EC_POINT_new(pCurve);
    pr_ss_iBase = EC_POINT_new(pCurve);
    pr_ss_iPubKey = EC_POINT_new(pCurve);
    pc_iA = EC_POINT_new(pCurve);
    pBs_i = EC_POINT_new(pCurve);
    pAs_i = EC_POINT_new(pCurve);
    pAs_i_add_c_iA = EC_POINT_new(pCurve);
    pall_messages_iBase = EC_POINT_new(pCurve);
    pB_sub_all_messages_iBase = EC_POINT_new(pCurve);
    pc_i_mult_B_sub_all_messages_iBase = EC_POINT_new(pCurve);
    pRightSide = EC_POINT_new(pCurve);

    pbn_c_sum = BN_new();
    pbn_c_i = BN_new();
    pbn_rss_i = BN_new();
    pbn_hash = BN_new();
    pbn_all_messages_i = BN_new();
    pbn_q = BN_new();

    pbn_r = BN_new();
    pbn_rss_real = BN_new();
    pbn_c_real = BN_new();

    err = EC_GROUP_get_order(pCurve, pbn_q, ctx);
    if (err != 1)
        goto exit;

    BN_zero(pbn_c_sum);

    binBE2EC_POINT(pCurve, p_PubKey, pPubKey);
    binBE2EC_POINT(pCurve, p_A, pA);
    binBE2EC_POINT(pCurve, p_B, pB);

    BN_bin2bn(p_r, GF_LEN, pbn_r);

    for (unsigned int i = 0; i < num_of_messages; i++) {
        if (message != p_all_messages[i]) {

            err = GenRndInField(pbn_q, pbn_c_i);
            if (err != 1)
                goto exit;

            BN_bn2binpad(pbn_c_i, p_c + i * GF_LEN, GF_LEN);

            err = GenRndInField(pbn_q, pbn_rss_i);
            if (err != 1)
                goto exit;

            BN_bn2binpad(pbn_rss_i, p_rss + i * GF_LEN, GF_LEN);

            BN_mod_add(pbn_c_sum, pbn_c_sum, pbn_c_i, pbn_q, ctx);

            // As_i = r_ss[i]*Base - c_[i]*A

            // r_ss[i]*Base
            err = EC_POINT_mul(pCurve, pr_ss_iBase, pbn_rss_i, NULL, NULL, ctx);
            if (err != 1)
                goto exit;

            // c_[i]*A
            err = EC_POINT_mul(pCurve, pc_iA, NULL, pA, pbn_c_i, ctx);
            if (err != 1)
                goto exit;

            // negate all_messages[i]*Base
            err = EC_POINT_invert(pCurve, pc_iA, ctx);
            if (err != 1)
                goto exit;

            err = EC_POINT_add(pCurve, pAs_i, pr_ss_iBase, pc_iA, ctx);
            if (err != 1)
                goto exit;

            err = EC_POINT2binBE(pCurve, pAs_i, p_As + i * 2 * GF_LEN);
            if (err != 1)
                goto exit;

            //////////////////////////////////////////////////////////////////////////////////////////////

            // Bs_i = r_ss[i]*PubKey - c_[i]*(B - all_messages[i]*Base)

            // r_ss[i]*PubKey:
            err = EC_POINT_mul(pCurve, pr_ss_iPubKey, NULL, pPubKey, pbn_rss_i, ctx);
            if (err != 1)
                goto exit;

            // all_messages[i]*Base:
            BN_set_word(pbn_all_messages_i, p_all_messages[i]);

            err = EC_POINT_mul(pCurve, pall_messages_iBase, pbn_all_messages_i, NULL, NULL, ctx);
            if (err != 1)
                goto exit;

            // - all_messages[i]*Base:
            err = EC_POINT_invert(pCurve, pall_messages_iBase, ctx);
            if (err != 1)
                goto exit;

            // B - all_messages[i]*Base:
            err = EC_POINT_add(pCurve, pB_sub_all_messages_iBase, pB, pall_messages_iBase, ctx);
            if (err != 1)
                goto exit;

            // c_[i]*(B - all_messages[i]*Base)
            err = EC_POINT_mul(pCurve, pc_i_mult_B_sub_all_messages_iBase, NULL, pB_sub_all_messages_iBase,
                               pbn_c_i,
                               ctx);
            if (err != 1)
                goto exit;

            // - c_[i]*(B - all_messages[i]*Base)
            err = EC_POINT_invert(pCurve, pc_i_mult_B_sub_all_messages_iBase, ctx);
            if (err != 1)
                goto exit;

            // r_ss[i]*PubKey - c_[i]*(B - all_messages[i]*Base)
            err = EC_POINT_add(pCurve, pBs_i, pr_ss_iPubKey, pc_i_mult_B_sub_all_messages_iBase, ctx);
            if (err != 1)
                goto exit;

            err = EC_POINT2binBE(pCurve, pBs_i, p_Bs + i * 2 * GF_LEN);
            if (err != 1)
                goto exit;

        } else {
            iIndexOfReal = i;

            err = GenRndInField(pbn_q, pbn_rss_real);
            if (err != 1)
                goto exit;

            // As_i = pbn_rss_real*Base
            err = EC_POINT_mul(pCurve, pAs_i, pbn_rss_real, NULL, NULL, ctx);
            if (err != 1)
                goto exit;


            err = EC_POINT2binBE(pCurve, pAs_i, p_As + i * 2 * GF_LEN);
            if (err != 1)
                goto exit;


            // Bs_i = pbn_rss_real*PubKey:
            err = EC_POINT_mul(pCurve, pBs_i, NULL, pPubKey, pbn_rss_real, ctx);
            if (err != 1)
                goto exit;

            err = EC_POINT2binBE(pCurve, pBs_i, p_Bs + i * 2 * GF_LEN);
            if (err != 1)
                goto exit;

        }

    }

    init_gost2012_hash_ctx(&gost_ctx, 256);
/*
    gost2012_hash_block(&gost_ctx, p_PubKey, 2*GF_LEN);
    gost2012_hash_block(&gost_ctx, p_A, 2*GF_LEN);
    gost2012_hash_block(&gost_ctx, p_B, 2*GF_LEN);
*/

    err = Point2HexCompressed(pCurve, pPubKey, pszPointCompressed);
    if (err != 1)
        goto exit;

    gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN);

    err = Point2HexCompressed(pCurve, pA, pszPointCompressed);
    if (err != 1)
        goto exit;

    gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN);

    err = Point2HexCompressed(pCurve, pB, pszPointCompressed);
    if (err != 1)
        goto exit;

    gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN);


    //gost2012_hash_block(&gost_ctx, p_As, num_of_messages*2*GF_LEN);
    //gost2012_hash_block(&gost_ctx, p_Bs, num_of_messages*2*GF_LEN);

    for (unsigned int i = 0; i < num_of_messages; i++) {
        //unsigned char p_As_i[2*GF_LEN];
        err = binBE2EC_POINT(pCurve, p_As + i * 2 * GF_LEN, pAs_i);
        if (err != 1)
            goto exit;

        err = Point2HexCompressed(pCurve, pAs_i, pszPointCompressed);
        if (err != 1)
            goto exit;

        gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN);
    }

    for (unsigned int i = 0; i < num_of_messages; i++) {
        //unsigned char p_As_i[2*GF_LEN];
        err = binBE2EC_POINT(pCurve, p_Bs + i * 2 * GF_LEN, pBs_i);
        if (err != 1)
            goto exit;

        err = Point2HexCompressed(pCurve, pBs_i, pszPointCompressed);
        if (err != 1)
            goto exit;

        gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN);
    }

    gost2012_finish_hash(&gost_ctx, pHash);

    BN_bin2bn(pHash, GF_LEN, pbn_hash);

    // c_of_real = (c - c_sum) % n
    BN_mod_sub(pbn_c_real, pbn_hash, pbn_c_sum, pbn_q, ctx);

    BN_bn2binpad(pbn_c_real, p_c + iIndexOfReal * GF_LEN, GF_LEN);


    //r_ss_real = ( r_ss_real + c_of_real*r ) % q

    // c_of_real*r mo q
    // (use pbn_r for result)
    BN_mod_mul(pbn_r, pbn_r, pbn_c_real, pbn_q, ctx);


    //r_ss_real + c_of_real*r
    BN_mod_add(pbn_rss_real, pbn_rss_real, pbn_r, pbn_q, ctx);

    BN_bn2binpad(pbn_rss_real, p_rss + iIndexOfReal * GF_LEN, GF_LEN);

    exit:
    BN_free(pbn_c_sum);
    BN_free(pbn_c_i);
    BN_free(pbn_rss_i);
    BN_free(pbn_hash);
    BN_free(pbn_all_messages_i);
    BN_free(pbn_q);

    BN_free(pbn_r);
    BN_free(pbn_rss_real);
    BN_free(pbn_c_real);

    EC_POINT_free(pPubKey);
    EC_POINT_free(pA);
    EC_POINT_free(pB);
    EC_POINT_free(pr_ss_iPubKey);
    EC_POINT_free(pc_iA);
    EC_POINT_free(pAs_i);
    EC_POINT_free(pAs_i_add_c_iA);
    EC_POINT_free(pall_messages_iBase);
    EC_POINT_free(pB_sub_all_messages_iBase);
    EC_POINT_free(pc_i_mult_B_sub_all_messages_iBase);
    EC_POINT_free(pRightSide);

    EC_GROUP_free(pCurve);

    BN_CTX_free(ctx);

    return err;
}


int VerifyRangeProofExParamsetA(
        const unsigned char *p_PubKey,
        const unsigned int *p_all_messages,
        const unsigned int num_of_messages,
        const unsigned char *p_A,
        const unsigned char *p_B,
        const unsigned char *p_As,
        const unsigned char *p_Bs,
        const unsigned char *p_c,
        const unsigned char *p_rss) {
    int err = 1;
    EC_GROUP *pCurve;
    BIGNUM *pbn_c_sum, *pbn_c_i, *pbn_rss_i, *pbn_hash, *pbn_all_messages_i, *pbn_q;
    EC_POINT *pPubKey, *pA, *pB, *pr_ss_iBase, *pr_ss_iPubKey, *pc_iA, *pAs_i, *pBs_i, *pAs_i_add_c_iA,
            *pall_messages_iBase, *pB_sub_all_messages_iBase, *pc_i_mult_B_sub_all_messages_iBase, *pRightSide;
    unsigned char pHash[GF_LEN];
    gost2012_hash_ctx gost_ctx;
    BN_CTX *ctx;

    ctx = BN_CTX_new();

    init_gost2012_hash_ctx(&gost_ctx, 256);

    gost2012_hash_block(&gost_ctx, p_PubKey, 2 * GF_LEN);
    gost2012_hash_block(&gost_ctx, p_A, 2 * GF_LEN);
    gost2012_hash_block(&gost_ctx, p_B, 2 * GF_LEN);

    gost2012_hash_block(&gost_ctx, p_As, num_of_messages * 2 * GF_LEN);

    gost2012_hash_block(&gost_ctx, p_Bs, num_of_messages * 2 * GF_LEN);

    gost2012_finish_hash(&gost_ctx, pHash);

    pCurve = create_curve();
    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }

    pPubKey = EC_POINT_new(pCurve);
    pA = EC_POINT_new(pCurve);
    pB = EC_POINT_new(pCurve);
    pr_ss_iBase = EC_POINT_new(pCurve);
    pr_ss_iPubKey = EC_POINT_new(pCurve);
    pc_iA = EC_POINT_new(pCurve);
    pBs_i = EC_POINT_new(pCurve);
    pAs_i = EC_POINT_new(pCurve);
    pAs_i_add_c_iA = EC_POINT_new(pCurve);
    pall_messages_iBase = EC_POINT_new(pCurve);
    pB_sub_all_messages_iBase = EC_POINT_new(pCurve);
    pc_i_mult_B_sub_all_messages_iBase = EC_POINT_new(pCurve);
    pRightSide = EC_POINT_new(pCurve);

    pbn_c_sum = BN_new();
    pbn_c_i = BN_new();
    pbn_rss_i = BN_new();
    pbn_hash = BN_new();
    pbn_all_messages_i = BN_new();
    pbn_q = BN_new();

    err = EC_GROUP_get_order(pCurve, pbn_q, ctx);
    if (err != 1)
        goto exit;

    BN_zero(pbn_c_sum);

    binBE2EC_POINT(pCurve, p_PubKey, pPubKey);
    binBE2EC_POINT(pCurve, p_A, pA);
    binBE2EC_POINT(pCurve, p_B, pB);


    for (unsigned int i = 0; i < num_of_messages; i++) {
        // r_ss[i]*Base == A_s[i] + c_[i]*A

        BN_bin2bn(p_c + i * GF_LEN, GF_LEN, pbn_c_i);
        BN_mod_add(pbn_c_sum, pbn_c_sum, pbn_c_i, pbn_q, ctx);

        BN_bin2bn(p_rss + i * GF_LEN, GF_LEN, pbn_rss_i);

        err = EC_POINT_mul(pCurve, pr_ss_iBase, pbn_rss_i, NULL, NULL, ctx);
        if (err != 1)
            goto exit;

        err = EC_POINT_mul(pCurve, pc_iA, NULL, pA, pbn_c_i, ctx);
        if (err != 1)
            goto exit;

        binBE2EC_POINT(pCurve, p_As + i * 2 * GF_LEN, pAs_i);

        err = EC_POINT_add(pCurve, pAs_i_add_c_iA, pAs_i, pc_iA, ctx);
        if (err != 1)
            goto exit;


        err = EC_POINT_cmp(pCurve, pr_ss_iBase, pAs_i_add_c_iA, ctx);
        if (err != 0) // points are not equal
        {
            err = 0;
            goto exit;
        }
        ///////////////////////////////////////////////////////////////////
        // r_ss[i]*PubKey == B_s[i] + c_[i]*(B - all_messages[i]*Base)

        // r_ss[i]*PubKey :
        err = EC_POINT_mul(pCurve, pr_ss_iPubKey, NULL, pPubKey, pbn_rss_i, ctx);
        if (err != 1)
            goto exit;

        // B_s[i]:
        binBE2EC_POINT(pCurve, p_Bs + i * 2 * GF_LEN, pBs_i);

        // all_messages[i]*Base :

        BN_set_word(pbn_all_messages_i, p_all_messages[i]);

        err = EC_POINT_mul(pCurve, pall_messages_iBase, pbn_all_messages_i, NULL, NULL, ctx);
        if (err != 1)
            goto exit;



        // negate all_messages[i]*Base
        err = EC_POINT_invert(pCurve, pall_messages_iBase, ctx);
        if (err != 1)
            goto exit;



        // B - all_messages[i]*Base
        err = EC_POINT_add(pCurve, pB_sub_all_messages_iBase, pB, pall_messages_iBase, ctx);
        if (err != 1)
            goto exit;

        // c_[i]*(B - all_messages[i]*Base)
        err = EC_POINT_mul(pCurve, pc_i_mult_B_sub_all_messages_iBase, NULL, pB_sub_all_messages_iBase, pbn_c_i,
                           ctx);
        if (err != 1)
            goto exit;

        // and at last all right side :
        // B_s[i] + c_[i]*(B - all_messages[i]*Base)
        err = EC_POINT_add(pCurve, pRightSide, pBs_i, pc_i_mult_B_sub_all_messages_iBase, ctx);
        if (err != 1)
            goto exit;

        if (EC_POINT_cmp(pCurve, pr_ss_iPubKey, pRightSide, ctx)) {
            err = 0;
            goto exit;
        }

    }

    BN_bin2bn(pHash, GF_LEN, pbn_hash);

    BN_mod(pbn_hash, pbn_hash, pbn_q, ctx);

    if (BN_cmp(pbn_hash, pbn_c_sum)) {
        err = 0;
        goto exit;
    }

    exit:
    BN_free(pbn_c_sum);
    BN_free(pbn_c_i);
    BN_free(pbn_rss_i);
    BN_free(pbn_hash);
    BN_free(pbn_all_messages_i);
    BN_free(pbn_q);

    EC_POINT_free(pPubKey);
    EC_POINT_free(pA);
    EC_POINT_free(pB);
    EC_POINT_free(pr_ss_iPubKey);
    EC_POINT_free(pc_iA);
    EC_POINT_free(pAs_i);
    EC_POINT_free(pAs_i_add_c_iA);
    EC_POINT_free(pall_messages_iBase);
    EC_POINT_free(pB_sub_all_messages_iBase);
    EC_POINT_free(pc_i_mult_B_sub_all_messages_iBase);
    EC_POINT_free(pRightSide);

    EC_GROUP_free(pCurve);

    BN_CTX_free(ctx);

    return err;
}


int publicKeyMul(const unsigned char *point, const unsigned char *scalar, unsigned char *Result) {
    int err = 1;
    EC_GROUP *pCurve;
    BN_CTX *ctx;

    unsigned char pointX[GF_LEN];
    unsigned char flag, flagResult;

    ctx = BN_CTX_new();

    EC_POINT *Point;

    pCurve = create_curve();
    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }

    initContexts();

    for (unsigned int i = 0; i < GF_LEN; i++) {
        pointX[i] = point[i + 1];
    }

    Point = EC_POINT_new(pCurve);

    flag = getFlag(point);

    err = binBE2EC_POINTCompressed(pCurve, pointX, flag, Point);
    if (err != 1)
        goto exit;

    err = EC_POINT_is_on_curve(pCurve, Point, ctx);
    if (err != 1)
        goto exit;

    unsigned char PointUnpacked[GF_LEN * 2];
    err = EC_POINT2binBE(pCurve, Point, PointUnpacked);
    if (err != 1)
        goto exit;


    unsigned char ResultUnpacked[GF_LEN * 2];

    err = CryptoProScalarMultEx(scalar, PointUnpacked, ResultUnpacked);
    if (err != 1) {
        err = GetLastError();
        goto exit;
    }

    flagResult = IsOdd(ResultUnpacked, 2 * GF_LEN);


    for (unsigned int i = GF_LEN; i > 0; i--) {
        Result[i] = ResultUnpacked[i - 1];
    }
    if (flagResult == 0) {
        Result[0] = 0x02;
    } else {
        Result[0] = 0x03;
    }

    exit:
    EC_POINT_free(Point);
    EC_GROUP_free(pCurve);
    BN_CTX_free(ctx);

    if (err == 1) {
        return TRUE;
    } else {
        return FALSE;
    }
}


int publicKeyAdd(const unsigned char *P1, const unsigned char *P2, unsigned char *Result) {
    int err = 1;
    EC_GROUP *pCurve;
    BN_CTX *ctx;
    EC_POINT *Point1, *Point2;
    unsigned char flag1, flag2, resFlag;
    unsigned char P1x[32], P2x[32];

    ctx = BN_CTX_new();

    pCurve = create_curve();
    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }


    for (unsigned int i = 0; i < GF_LEN; i++) {
        P1x[i] = P1[i + 1];
    }

    for (unsigned int i = 0; i < GF_LEN; i++) {
        P2x[i] = P2[i + 1];
    }

    Point1 = EC_POINT_new(pCurve);
    Point2 = EC_POINT_new(pCurve);

    flag1 = getFlag(P1);
    flag2 = getFlag(P2);

    err = binBE2EC_POINTCompressed(pCurve, P1x, flag1, Point1);
    if (err != 1)
        goto exit;

    err = binBE2EC_POINTCompressed(pCurve, P2x, flag2, Point2);
    if (err != 1)
        goto exit;


    err = EC_POINT_add(pCurve, Point1, Point2, Point1, ctx);
    if (err != 1)
        goto exit;

    err = EC_POINT2binBECompressed(pCurve, Point1, Result, &flag1);
    if (err != 1)
        goto exit;


    for (unsigned int i = GF_LEN; i > 0; i--) {
        Result[i] = Result[i - 1];
    }
    if (flag1 == 0) {
        Result[0] = 0x02;
    } else {
        Result[0] = 0x03;
    }


    exit:

    EC_POINT_free(Point1);
    EC_POINT_free(Point2);
    EC_GROUP_free(pCurve);


    BN_CTX_free(ctx);

    return err;
}

int solveDLP(
        const unsigned char *points,
        const unsigned int num,
        const unsigned long total,
        unsigned long *Result
) {
    int err = 1;
    EC_GROUP *pCurve;
    BN_CTX *ctx;
    EC_POINT *Points[num], *pBase, *pCursor;
    unsigned char flag;
    unsigned char x[32];
    BIGNUM *xBase, *yBase;


    ctx = BN_CTX_new();

    pCurve = create_curve();
    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }


    pCursor = EC_POINT_new(pCurve);
    pBase = EC_POINT_new(pCurve);

    for (int i = 0; i < num; i++) {
        Points[i] = EC_POINT_new(pCurve);

        for (unsigned int j = 0; j < GF_LEN; j++) {
            x[j] = points[i * (GF_LEN + 1) + j + 1];
        }

        if (points[i * (GF_LEN + 1)] == 0x02) {
            flag = 0;
        } else if (points[i * (GF_LEN + 1)] == 0x03) {
            flag = 1;
        }


        err = binBE2EC_POINTCompressed(pCurve, x, flag, Points[i]);
        if (err != 1)
            goto exit;

    }

    xBase = BN_bin2bn(x_bin, sizeof(x_bin), NULL);
    yBase = BN_bin2bn(y_bin, sizeof(y_bin), NULL);


    err = EC_POINT_set_affine_coordinates_GFp(pCurve, pBase, xBase, yBase, NULL);
    if (err != 1) {
        goto exit;
    }

    err = EC_POINT_copy(pCursor, pBase);
    if (err != 1)
        goto exit;


    for (unsigned long i = 0; i < total; i++) {
        for (unsigned int j = 0; j < num; j++) {
            if (EC_POINT_cmp(pCurve, pCursor, Points[j], ctx) == 0) {
                Result[j] = i + 1;
            }
        }
        EC_POINT_add(pCurve, pCursor, pCursor, pBase, ctx);
    }


    exit:

    for (int i = 0; i < num; i++) {
        EC_POINT_free(Points[i]);
    }
    EC_POINT_free(pCursor);
    EC_POINT_free(pBase);

    EC_GROUP_free(pCurve);

    BN_free(xBase);
    BN_free(yBase);

    BN_CTX_free(ctx);

    return err;

}

int publicKeyCombine(
        const unsigned char *points,
        const unsigned int num,
        unsigned char *Result
) {
    int err = 1;
    EC_GROUP *pCurve;
    BN_CTX *ctx;
    EC_POINT *Acc, *Point;
    unsigned char flagAcc, flagPoint, resFlag;
    unsigned char AccX[32], PointX[32];

    ctx = BN_CTX_new();

    pCurve = create_curve();
    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }


    Acc = EC_POINT_new(pCurve);
    for (unsigned int i = 0; i < GF_LEN; i++) {
        AccX[i] = points[i + 1];
    }
    if (points[0] == 0x02) {
        flagAcc = 0;
    } else if (points[0] == 0x03) {
        flagAcc = 1;
    }

    err = binBE2EC_POINTCompressed(pCurve, AccX, flagAcc, Acc);
    if (err != 1)
        goto exit;


    Point = EC_POINT_new(pCurve);
    for (unsigned int offset = GF_LEN + 1; offset < num * (GF_LEN + 1); offset += GF_LEN + 1) {
        for (unsigned int i = 0; i < GF_LEN; i++) {
            PointX[i] = points[offset + i + 1];
        }

        if (points[offset] == 0x02) {
            flagPoint = 0;
        } else if (points[offset] == 0x03) {
            flagPoint = 1;
        }

        err = binBE2EC_POINTCompressed(pCurve, PointX, flagPoint, Point);
        if (err != 1)
            goto exit;

        err = EC_POINT_add(pCurve, Acc, Point, Acc, ctx);
        if (err != 1)
            goto exit;
    }

    err = EC_POINT2binBECompressed(pCurve, Acc, Result, &flagAcc);
    if (err != 1)
        goto exit;

    for (unsigned int i = GF_LEN; i > 0; i--) {
        Result[i] = Result[i - 1];
    }
    if (flagAcc == 0) {
        Result[0] = 0x02;
    } else {
        Result[0] = 0x03;
    }


    exit:

    EC_POINT_free(Acc);
    EC_POINT_free(Point);
    EC_GROUP_free(pCurve);

    BN_CTX_free(ctx);

    return err;
}

BOOL validatePrivateKey(const unsigned char *publicKey, const unsigned char *privateKey) {
    int err = 1;

    unsigned char *PrivateKeyMultBase[33];
    err = publicKeyMul(cryptoProBaseCompressed, privateKey, (unsigned char *) PrivateKeyMultBase);
    if (err != 1)
        goto exit;

    err = memcmp(PrivateKeyMultBase, publicKey, GF_LEN + 1) == 0;

    exit:

    if (err == 1) {
        return TRUE;
    } else {
        return FALSE;
    }
}


// zkp
BOOL VerifyRangeProofExCompressed(
        const unsigned char *p_PubKeyx, unsigned char flagPubKey,
        const unsigned int *p_all_messages,
        const unsigned int num_of_messages,
        const unsigned char *p_Ax, unsigned char flagA,
        const unsigned char *p_Bx, unsigned char flagB,
        const unsigned char *p_Asx, const unsigned char *p_flagAs,
        const unsigned char *p_Bsx, const unsigned char *p_flagBs,
        const unsigned char *p_c,
        const unsigned char *p_rss) {
    unsigned long err = 1;
    EC_GROUP *pCurve;
    BIGNUM *pbn_c_sum, *pbn_c_i, *pbn_rss_i, *pbn_hash, *pbn_all_messages_i, *pbn_q;
    EC_POINT *pPubKey, *pA, *pB, *pr_ss_iBase, *pr_ss_iPubKey, *pc_iA, *pAs_i, *pBs_i, *pAs_i_add_c_iA,
            *pall_messages_iBase, *pB_sub_all_messages_iBase, *pc_i_mult_B_sub_all_messages_iBase, *pRightSide,
            *t1, *t2;
    unsigned char pHash[GF_LEN];
    gost2012_hash_ctx gost_ctx;
    BN_CTX *ctx;



    // not compressed form
    unsigned char p_PubKey[2 * GF_LEN];
    unsigned char p_A[2 * GF_LEN];
    unsigned char p_B[2 * GF_LEN];

    char pszPointCompressed[2 + 2 * GF_LEN + 1];

    ctx = BN_CTX_new();

    pCurve = create_curve();
    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }

    initContexts();

    pPubKey = EC_POINT_new(pCurve);
    pA = EC_POINT_new(pCurve);
    pB = EC_POINT_new(pCurve);
    pr_ss_iBase = EC_POINT_new(pCurve);
    pr_ss_iPubKey = EC_POINT_new(pCurve);
    pc_iA = EC_POINT_new(pCurve);
    pBs_i = EC_POINT_new(pCurve);
    pAs_i = EC_POINT_new(pCurve);
    pAs_i_add_c_iA = EC_POINT_new(pCurve);
    pall_messages_iBase = EC_POINT_new(pCurve);
    pB_sub_all_messages_iBase = EC_POINT_new(pCurve);
    pc_i_mult_B_sub_all_messages_iBase = EC_POINT_new(pCurve);
    pRightSide = EC_POINT_new(pCurve);
    t1 = EC_POINT_new(pCurve);
    t2 = EC_POINT_new(pCurve);

    pbn_c_sum = BN_new();
    pbn_c_i = BN_new();
    pbn_rss_i = BN_new();
    pbn_hash = BN_new();
    pbn_all_messages_i = BN_new();
    pbn_q = BN_new();

    err = EC_GROUP_get_order(pCurve, pbn_q, ctx);
    if (err != 1)
        goto exit;

    BN_zero(pbn_c_sum);

    err = binBE2EC_POINTCompressed(pCurve, p_PubKeyx, flagPubKey, pPubKey);
    if (err != 1)
        goto exit;

    err = binBE2EC_POINTCompressed(pCurve, p_Ax, flagA, pA);
    if (err != 1)
        goto exit;

    err = binBE2EC_POINTCompressed(pCurve, p_Bx, flagB, pB);
    if (err != 1)
        goto exit;

    err = EC_POINT2binBE(pCurve, pPubKey, p_PubKey);
    if (err != 1)
        goto exit;

    err = EC_POINT2binBE(pCurve, pA, p_A);
    if (err != 1)
        goto exit;

    err = EC_POINT2binBE(pCurve, pB, p_B);
    if (err != 1)
        goto exit;


    init_gost2012_hash_ctx(&gost_ctx, 256);

/*
    gost2012_hash_block(&gost_ctx, p_PubKey, 2*GF_LEN);
    gost2012_hash_block(&gost_ctx, p_A, 2*GF_LEN);
    gost2012_hash_block(&gost_ctx, p_B, 2*GF_LEN);
*/

    err = Point2HexCompressed(pCurve, pPubKey, pszPointCompressed);
    if (err != 1)
        goto exit;

    gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN);

    err = Point2HexCompressed(pCurve, pA, pszPointCompressed);
    if (err != 1)
        goto exit;

    gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN);

    err = Point2HexCompressed(pCurve, pB, pszPointCompressed);
    if (err != 1)
        goto exit;

    gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN);

    for (unsigned int i = 0; i < num_of_messages; i++) {
        //unsigned char p_As_i[2*GF_LEN];

        err = binBE2EC_POINTCompressed(pCurve, p_Asx + i * GF_LEN, p_flagAs[i], pAs_i);
        if (err != 1)
            goto exit;
        /*
        err = EC_POINT2binBE(pCurve, pAs_i, p_As_i);
        if(err != 1)
            goto exit;
        */

        err = Point2HexCompressed(pCurve, pAs_i, pszPointCompressed);
        if (err != 1)
            goto exit;

        gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN);

        //gost2012_hash_block(&gost_ctx, p_As_i,2*GF_LEN);
    }

    for (unsigned int i = 0; i < num_of_messages; i++) {
        //unsigned char p_Bs_i[2*GF_LEN];

        err = binBE2EC_POINTCompressed(pCurve, p_Bsx + i * GF_LEN, p_flagBs[i], pBs_i);
        if (err != 1)
            goto exit;

        /*
        err = EC_POINT2binBE(pCurve, pBs_i, p_Bs_i);
        if(err != 1)
            goto exit;
        */

        err = Point2HexCompressed(pCurve, pBs_i, pszPointCompressed);
        if (err != 1)
            goto exit;

        gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN);

        //gost2012_hash_block(&gost_ctx, p_Bs_i,2*GF_LEN);
    }

    gost2012_finish_hash(&gost_ctx, pHash);

    for (unsigned int i = 0; i < num_of_messages; i++) {
        // r_ss[i]*Base == A_s[i] + c_[i]*A

        BN_bin2bn(p_c + i * GF_LEN, GF_LEN, pbn_c_i);
        BN_mod_add(pbn_c_sum, pbn_c_sum, pbn_c_i, pbn_q, ctx);


        unsigned char A1[64];
        err = CryptoProScalarMultEx(p_rss + i * GF_LEN, cryptoProBase, A1);
        if (err != 1) {
            err = GetLastError();
            goto exit;
        }


        unsigned char A2[64];
        err = CryptoProScalarMultEx(p_c + i * GF_LEN, p_A, A2);
        if (err != 1) {
            err = GetLastError();
            goto exit;
        }


        //binBE2EC_POINT(pCurve, p_As + i*2*GF_LEN, pAs_i);
        err = binBE2EC_POINTCompressed(pCurve, p_Asx + i * GF_LEN, p_flagAs[i], pAs_i);
        if (err != 1)
            goto exit;

        //binBE2EC_POINT(pCurve, p_As + i*2*GF_LEN, pAs_i);
        err = binBE2EC_POINT(pCurve, A1, t1);
        err = binBE2EC_POINT(pCurve, A2, t2);
        if (err != 1)
            goto exit;


        err = EC_POINT_add(pCurve, pAs_i_add_c_iA, pAs_i, t2, ctx);
        if (err != 1)
            goto exit;


        err = EC_POINT_cmp(pCurve, t1, pAs_i_add_c_iA, ctx);
        if (err != 0) // points are not equal
        {
            err = 0;
            goto exit;
        }

        ///////////////////////////////////////////////////////////////////
        // r_ss[i]*PubKey == B_s[i] + c_[i]*(B - all_messages[i]*Base)

        // r_ss[i]*PubKey :
        unsigned char B1[64];
        err = CryptoProScalarMultEx(p_rss + i * GF_LEN, p_PubKey, B1);
        if (err != 1) {
            err = GetLastError();
            goto exit;
        }



        // B_s[i]:
        //binBE2EC_POINT(pCurve, p_Bs + i*2*GF_LEN, pBs_i);
        err = binBE2EC_POINTCompressed(pCurve, p_Bsx + i * GF_LEN, p_flagBs[i], pBs_i);
        if (err != 1)
            goto exit;

        // all_messages[i]*Base :

        BN_set_word(pbn_all_messages_i, p_all_messages[i]);
        unsigned char t3[GF_LEN];
        BN_bn2binpad(pbn_all_messages_i, t3, GF_LEN);

        unsigned char B2[GF_LEN * 2];
        if (p_all_messages[i] != 0) {
            err = CryptoProScalarMultEx(t3, cryptoProBase, B2);
            if (err != 1) {
                err = GetLastError();
                goto exit;
            }

            err = binBE2EC_POINT(pCurve, B2, pall_messages_iBase);
            if (err != 1)
                goto exit;

            // negate all_messages[i]*Base
            err = EC_POINT_invert(pCurve, pall_messages_iBase, ctx);
            if (err != 1)
                goto exit;

            // B - all_messages[i]*Base
            err = EC_POINT_add(pCurve, pB_sub_all_messages_iBase, pB, pall_messages_iBase, ctx);
            if (err != 1)
                goto exit;
        } else {
            EC_POINT_copy(pB_sub_all_messages_iBase, pB);
        }


        unsigned char B3[GF_LEN * 2];
        err = EC_POINT2binBE(pCurve, pB_sub_all_messages_iBase, B3);
        if (err != 1)
            goto exit;

        err = CryptoProScalarMultEx(p_c + i * GF_LEN, B3, B2);
        if (err != 1) {
            err = GetLastError();
            goto exit;
        }


        // c_[i]*(B - all_messages[i]*Base)
        err = binBE2EC_POINT(pCurve, B2, pc_i_mult_B_sub_all_messages_iBase);
        if (err != 1)
            goto exit;


        // and at last all right side :
        // B_s[i] + c_[i]*(B - all_messages[i]*Base)
        err = EC_POINT_add(pCurve, pRightSide, pBs_i, pc_i_mult_B_sub_all_messages_iBase, ctx);
        if (err != 1)
            goto exit;


        err = binBE2EC_POINT(pCurve, B1, pr_ss_iPubKey);
        if (err != 1)
            goto exit;

        if (EC_POINT_cmp(pCurve, pr_ss_iPubKey, pRightSide, ctx)) {
//            printf("%i", i);

            err = 0;
            goto exit;
        }

    }

    BN_bin2bn(pHash, GF_LEN, pbn_hash);

    BN_mod(pbn_hash, pbn_hash, pbn_q, ctx);

    if (BN_cmp(pbn_hash, pbn_c_sum)) {
        err = 0;
        printf("%lu", GetLastError());
        goto exit;
    }

    exit:
    BN_free(pbn_c_sum);
    BN_free(pbn_c_i);
    BN_free(pbn_rss_i);
    BN_free(pbn_hash);
    BN_free(pbn_all_messages_i);
    BN_free(pbn_q);

    EC_POINT_free(pPubKey);
    EC_POINT_free(pA);
    EC_POINT_free(pB);
    EC_POINT_free(t1);
    EC_POINT_free(t2);
    EC_POINT_free(pr_ss_iPubKey);
    EC_POINT_free(pc_iA);
    EC_POINT_free(pAs_i);
    EC_POINT_free(pAs_i_add_c_iA);
    EC_POINT_free(pall_messages_iBase);
    EC_POINT_free(pB_sub_all_messages_iBase);
    EC_POINT_free(pc_i_mult_B_sub_all_messages_iBase);
    EC_POINT_free(pRightSide);
    EC_POINT_free(pr_ss_iBase);
    EC_POINT_free(pBs_i);

    EC_GROUP_free(pCurve);

    BN_CTX_free(ctx);

//    err = CryptReleaseContext(hProv, 0);

    if (err == 1) {
        return TRUE;
    } else {
        return FALSE;
    }
}

#define NUM_OF_MESSSAGES 3

int testRangeProofCompressed(int is_positive_test) {
    int err = 1;

    unsigned int message = 1;
    unsigned char p_message[GF_LEN];

    unsigned int p_all_Messages[NUM_OF_MESSSAGES] = {1, 0, 4};
    // message*Base:
    unsigned char p_Message[2 * GF_LEN];


    unsigned char p_priv[GF_LEN];
    unsigned char p_PubKey[2 * GF_LEN];


    // ElGamal random scalar
    unsigned char p_r[GF_LEN];

    // (A, B) encrypted on ElGamal message*Base

    unsigned char p_R[2 * GF_LEN];
    unsigned char p_C[2 * GF_LEN];

    unsigned char p_SharedSecret[2 * GF_LEN];

    // range proof:a
    unsigned char p_As[NUM_OF_MESSSAGES * 2 * GF_LEN];
    unsigned char p_Bs[NUM_OF_MESSSAGES * 2 * GF_LEN];
    unsigned char p_c[NUM_OF_MESSSAGES * GF_LEN];
    unsigned char p_r_ss[NUM_OF_MESSSAGES * GF_LEN];

    unsigned char p_Asx[NUM_OF_MESSSAGES * GF_LEN];
    unsigned char p_flagAs[NUM_OF_MESSSAGES];
    unsigned char p_Bsx[NUM_OF_MESSSAGES * GF_LEN];
    unsigned char p_flagBs[NUM_OF_MESSSAGES];


    // generate key pair:

    err = GenRndInFieldParamsetA(p_priv);
    if (err != 1)
        goto exit;

// priv*Base
    err = PointMultParamsetA(p_priv, NULL, p_PubKey);
    if (err != 1)
        goto exit;

// calc message*Base

    if (message) {
        memset(p_message, 0, GF_LEN);

        p_message[GF_LEN - 1] = message & 0xff;
        p_message[GF_LEN - 2] = (message >> 8) & 0xff;
        p_message[GF_LEN - 3] = (message >> 16) & 0xff;
        p_message[GF_LEN - 4] = (message >> 24) & 0xff;

        err = PointMultParamsetA(p_message, NULL, p_Message);
        if (err != 1)
            goto exit;
    }
// generate key random r:

    err = GenRndInFieldParamsetA(p_r);
    if (err != 1)
        if (err != 1)
            goto exit;

// r*Base:
    err = PointMultParamsetA(p_r, NULL, p_R);
    if (err != 1)
        goto exit;

// sharedSecret = r*PubKey:

    err = PointMultParamsetA(p_r, p_PubKey, p_SharedSecret);
    if (err != 1)
        goto exit;

// encrypt :

    if (message) {
        err = AddPointsParamsetA(p_Message, p_SharedSecret, p_C);
        if (err != 1)
            goto exit;
    } else
        memcpy(p_C, p_SharedSecret, 2 * GF_LEN);

    //printf("Entring MakeRangeProofExParamsetA\n");
    err = MakeRangeProofExParamsetA(message,
                                    p_PubKey,
                                    p_all_Messages,
                                    sizeof(p_all_Messages) / sizeof(p_all_Messages[0]),
                                    p_R,
                                    p_C,
                                    p_r,
                                    p_As,
                                    p_Bs,
                                    p_c,
                                    p_r_ss);

    if (err != 1)
        goto exit;

    if (!is_positive_test) {
        // spoil proof
        p_c[0] ^= 1;
    }
/*
    err = VerifyRangeProofExParamsetA(p_PubKey, p_all_Messages, NUM_OF_MESSSAGES, p_R, p_C, p_As, p_Bs, p_c, p_r_ss);
    if(err != 1)
    {
        if(!is_positive_test)
            err = 1;

        goto exit;
    }
*/

    // init flags:
    for (int i = 0; i < NUM_OF_MESSSAGES; i++) {
        memcpy(p_Asx + i * GF_LEN, p_As + i * 2 * GF_LEN, GF_LEN);
        memcpy(p_Bsx + i * GF_LEN, p_Bs + i * 2 * GF_LEN, GF_LEN);
        p_flagAs[i] = IsOdd(p_As + i * 2 * GF_LEN, 2 * GF_LEN);
        p_flagBs[i] = IsOdd(p_Bs + i * 2 * GF_LEN, 2 * GF_LEN);
    }

    err = VerifyRangeProofExCompressed(p_PubKey, IsOdd(p_PubKey, 2 * GF_LEN),
                                       p_all_Messages, NUM_OF_MESSSAGES,
                                       p_R, IsOdd(p_R, 2 * GF_LEN),
                                       p_C, IsOdd(p_C, 2 * GF_LEN),
                                       p_Asx, p_flagAs,
                                       p_Bsx, p_flagBs,
                                       p_c,
                                       p_r_ss);
    if (err != 1) {
        if (!is_positive_test)
            err = 1;

        goto exit;
    }

    exit:
    return err;
}


int testCompressPoint() {
    int err = 1;
    unsigned int flag;
    EC_GROUP *pCurve;
    BN_CTX *ctx;
    BIGNUM *pbn_u, *pbn_q, *bn_X, *bn_Y;
    EC_POINT *pU, *pU1;

    pbn_u = BN_new();
    pbn_q = BN_new();

    bn_X = BN_new();
    bn_Y = BN_new();

    ctx = BN_CTX_new();

    pCurve = create_curve();

    pU = EC_POINT_new(pCurve);
    pU1 = EC_POINT_new(pCurve);

    err = EC_GROUP_get_order(pCurve, pbn_q, ctx);
    if (err != 1)
        goto exit;

    for (int i = 0; i < 10; i++) {
        err = GenRndInField(pbn_q, pbn_u);
        if (err != 1)
            goto exit;

        err = EC_POINT_mul(pCurve, pU, pbn_u, NULL, NULL, ctx);
        if (err != 1)
            goto exit;

        PrintPoint(pCurve, pU);


        err = EC_POINT_get_affine_coordinates_GFp(pCurve, pU, bn_X, bn_Y, ctx);
        if (err == 0)
            goto exit;

        if (BN_is_odd(bn_Y))
            flag = 1;
        else
            flag = 0;

        err = EC_POINT_set_compressed_coordinates_GFp(pCurve, pU1, bn_X, flag, NULL);
        if (err != 1) {
            goto exit;
        }
        PrintPoint(pCurve, pU1);

        printf("\n");
    }

    exit:

    return err;
}


unsigned char rnd_buffer[512];

int ElGamalEncryptCompressed(const unsigned char *p_Mx, unsigned char flagM,
                             const unsigned char *p_Pubx, unsigned char flagPub,
                             unsigned char *p_Rx, unsigned char *p_flagR,
                             unsigned char *p_Cx, unsigned char *p_flagC) {
    int err = 0;

    EC_GROUP *pCurve;
    BN_CTX *ctx;
    BIGNUM *pbn_r, *pbn_q;
    EC_POINT *pR, *pC, *pM, *pPub, *pSharedSecret;

    pbn_r = BN_new();
    pbn_q = BN_new();

    ctx = BN_CTX_new();

    pCurve = create_curve();

    pR = EC_POINT_new(pCurve);
    pC = EC_POINT_new(pCurve);

    pM = EC_POINT_new(pCurve);
    pPub = EC_POINT_new(pCurve);

    pSharedSecret = EC_POINT_new(pCurve);

    err = EC_GROUP_get_order(pCurve, pbn_q, ctx);
    if (err != 1)
        goto exit;

    err = binBE2EC_POINTCompressed(pCurve, p_Mx, flagM, pM);
    if (err != 1)
        goto exit;

    err = binBE2EC_POINTCompressed(pCurve, p_Pubx, flagPub, pPub);
    if (err != 1)
        goto exit;

//  generate r:
    err = GenRndInField(pbn_q, pbn_r);
    if (err != 1)
        goto exit;

//  R = r*Base
    err = EC_POINT_mul(pCurve, pR, pbn_r, NULL, NULL, ctx);
    if (err != 1)
        goto exit;

    err = EC_POINT2binBECompressed(pCurve, pR, p_Rx, p_flagR);
    if (err != 1)
        goto exit;

// SharedSecret = r*Pub :

    err = EC_POINT_mul(pCurve, pSharedSecret, NULL, pPub, pbn_r, ctx);
    if (err != 1)
        goto exit;

// C = SharedSecret + M
    err = EC_POINT_add(pCurve, pC, pSharedSecret, pM, ctx);
    if (err != 1)
        goto exit;

    err = EC_POINT2binBECompressed(pCurve, pC, p_Cx, p_flagC);
    if (err != 1)
        goto exit;

    exit:
    BN_free(pbn_r);
    BN_free(pbn_q);

    EC_POINT_free(pR);
    EC_POINT_free(pC);
    EC_POINT_free(pM);
    EC_POINT_free(pPub);
    EC_POINT_free(pSharedSecret);

    EC_GROUP_free(pCurve);
    BN_CTX_free(ctx);

    return err;
}

int ElGamalDecryptCompressed(const unsigned char *p_Rx, unsigned char flagR,
                             const unsigned char *p_Cx, unsigned char flagC,
                             const unsigned char *p_priv,
                             unsigned char *p_Mx, unsigned char *p_flagM) {
    int err = 0;

    EC_GROUP *pCurve;
    BN_CTX *ctx;
    BIGNUM *pbn_priv, *pbn_q;
    EC_POINT *pR, *pC, *pM, *pSharedSecret;

    pbn_q = BN_new();
    pbn_priv = BN_new();

    ctx = BN_CTX_new();

    pCurve = create_curve();

    pR = EC_POINT_new(pCurve);
    pC = EC_POINT_new(pCurve);
    pM = EC_POINT_new(pCurve);
    pSharedSecret = EC_POINT_new(pCurve);

    err = EC_GROUP_get_order(pCurve, pbn_q, ctx);
    if (err != 1)
        goto exit;

    err = binBE2EC_POINTCompressed(pCurve, p_Rx, flagR, pR);
    if (err != 1)
        goto exit;

    err = binBE2EC_POINTCompressed(pCurve, p_Cx, flagC, pC);
    if (err != 1)
        goto exit;

    BN_bin2bn(p_priv, GF_LEN, pbn_priv);


// SharedSecret = priv*R :

    err = EC_POINT_mul(pCurve, pSharedSecret, NULL, pR, pbn_priv, ctx);
    if (err != 1)
        goto exit;

// M = C - SharedSecret

// first, calculate - SharedSecret
    err = EC_POINT_invert(pCurve, pSharedSecret, ctx);
    if (err != 1)
        goto exit;

    err = EC_POINT_add(pCurve, pM, pC, pSharedSecret, ctx);
    if (err != 1)
        goto exit;

    err = EC_POINT2binBECompressed(pCurve, pM, p_Mx, p_flagM);
    if (err != 1)
        goto exit;

    exit:
    BN_free(pbn_priv);
    BN_free(pbn_q);

    EC_POINT_free(pR);
    EC_POINT_free(pC);
    EC_POINT_free(pM);
    EC_POINT_free(pSharedSecret);

    EC_GROUP_free(pCurve);
    BN_CTX_free(ctx);

    return err;

}

int testElGamalCompressed() {
    int err;
    unsigned char p_priv[GF_LEN];

    unsigned char p_Pubx[GF_LEN];
    unsigned char flagPub;

    unsigned char p_aux[GF_LEN];
    unsigned char p_Mx[GF_LEN];
    unsigned char flagM;

    unsigned char p_Rx[GF_LEN];
    unsigned char flagR;

    unsigned char p_Cx[GF_LEN];
    unsigned char flagC;

    unsigned char p_DecrMx[GF_LEN];
    unsigned char flagDecrM;

    err = GeneratePairCompressed(p_priv, p_Pubx, &flagPub);
    if (err != 1)
        goto exit;

    PrintBuff(p_priv, GF_LEN);

    err = GeneratePairCompressed(p_aux, p_Mx, &flagM);
    if (err != 1)
        goto exit;

    PrintBuff(p_Mx, GF_LEN);

    err = ElGamalEncryptCompressed(p_Mx, flagM, p_Pubx, flagPub, p_Rx, &flagR, p_Cx, &flagC);
    if (err != 1)
        goto exit;

    PrintBuff(p_Rx, GF_LEN);
    PrintBuff(p_Cx, GF_LEN);

    err = ElGamalDecryptCompressed(p_Rx, flagR, p_Cx, flagC, p_priv, p_DecrMx, &flagDecrM);
    if (err != 1)
        goto exit;

    PrintBuff(p_DecrMx, GF_LEN);

    if (memcmp(p_DecrMx, p_Mx, GF_LEN)) {
        err = 0;
        goto exit;
    }

    if (flagDecrM != flagM) {
        err = 0;
        goto exit;
    }

    exit:
    return err;
}


BOOL ImportPointCompressed(const unsigned char *point, HCRYPTKEY *phKey) {
    BOOL bOK;

    initContexts();

    unsigned char pointX[32];
    unsigned char flag;

    flag = point[0];

    for (int i = 0; i < GF_LEN; i++) {
        pointX[i] = point[i + 1];
    }

    reverseBytes(pointX, GF_LEN);


    unsigned char pPubKeyBlobCompressed[29 + 32 + 1] = {
            0x06, 0x20, 0x00, 0x00, 0x49, 0x2E, 0x00, 0x00, 0x4D, 0x41, 0x47, 0x31, 0x08, 0x01, 0x00, 0x00,
            0x30, 0x0B, 0x06, 0x09, 0x2A, 0x85, 0x03, 0x07, 0x01, 0x02, 0x01, 0x01, 0x02,};

    memcpy(pPubKeyBlobCompressed + 29, pointX, 32);

    pPubKeyBlobCompressed[29 + 32] = flag;

    bOK = CryptImportKey(hProv, pPubKeyBlobCompressed, sizeof(pPubKeyBlobCompressed), NULL, PUBLICKEYBLOB, phKey);
    if (!bOK)
        return FALSE;

    return bOK;
}

BOOL HashData(const unsigned char *pMsg,
              DWORD dwMsgLen,
              unsigned char *pHash) {
    HCRYPTHASH hHash;
    DWORD dwHashLen = GF_LEN;

    initContexts();

    if (!CryptCreateHash(
            hProv,
            CALG_GR3411_2012_256,
            0,
            0,
            &hHash))
        return FALSE;

    if (!CryptHashData(
            hHash,
            pMsg,
            dwMsgLen,
            0))
        return FALSE;

    if (!CryptGetHashParam(
            hHash,
            HP_HASHVAL,
            pHash,
            &dwHashLen,
            0))
        return FALSE;

    return TRUE;
}

BOOL ScalarMultCompressed(const unsigned char *p_Num, const unsigned char *p_Point,
                          unsigned char *Result) {
    BOOL bOK;
    HCRYPTKEY hKey;

    initContexts();


    unsigned char pbKeyBlob[29 + 64];
    unsigned char p_ResultPoint[33];
    const char *oid = szOID_tc26_gost_3410_12_256_paramSetB;

    // Зададим множитель m как байтовую строку в LE
    BYTE bNum[32];
    CRYPT_DATA_BLOB cdbNum = {0x20, bNum};

    DWORD dwBlobLen = 29 + 32 + 1;

    memcpy(cdbNum.pbData, p_Num, 32);


    bOK = ImportPointCompressed(p_Point, &hKey);
    if (!bOK)
        return FALSE;

    // Получим в hKey ( (m * sk) mod q, m * pk)

    bOK = CryptSetKeyParam(hKey, KP_MULX, (BYTE *) &cdbNum, 0);
    if (!bOK) {
        return FALSE;
    }

    //--------------------------------------------------------------------
    // Экспортирование открытого ключа получателя в BLOB открытого ключа.

    if (!CryptExportKey(
            hKey,
            0,
            PUBLICKEYBLOB,
            CRYPT_PUBLICCOMPRESS,
            pbKeyBlob,
            &dwBlobLen)) {
        return FALSE;
    }

    memcpy(p_ResultPoint, pbKeyBlob + 29, 32 + 1);

    memcpy(Result + 1, p_ResultPoint, GF_LEN);
    reverseBytes(Result + 1, GF_LEN);
    Result[0] = p_ResultPoint[32];
    /////////////////////////////////////////////////////////////////////////////////////

    // освобождаем память
    bOK = CryptDestroyKey(hKey);
    if (!bOK)
        return FALSE;

    return bOK;
}

BOOL HashCompresedPointsBE(const unsigned char *pCompressedPoints, unsigned int uiNumOfPoints, unsigned char *pHash) {
    BOOL b;
    unsigned char *pPoints2Hash;
    unsigned char *pPoints2HashHex;
    unsigned int i = 0;

    initContexts();

    gost2012_hash_ctx gost_ctx;

    pPoints2Hash = (unsigned char *) malloc(uiNumOfPoints * (GF_LEN + 1));
    pPoints2HashHex = (unsigned char *) malloc(uiNumOfPoints * 2 * (GF_LEN + 1));
    if (!pPoints2Hash || !pPoints2HashHex) {
        b = FALSE;
        goto exit;
    }

    memcpy(pPoints2Hash, pCompressedPoints, uiNumOfPoints * (GF_LEN + 1));


    init_gost2012_hash_ctx(&gost_ctx, 256);

    toHex(pPoints2Hash, uiNumOfPoints * (GF_LEN + 1), pPoints2HashHex, uiNumOfPoints * 2 * (GF_LEN + 1));

    gost2012_hash_block(&gost_ctx, pPoints2HashHex, uiNumOfPoints * 2 * (GF_LEN + 1));

    gost2012_finish_hash(&gost_ctx, pHash);

    b = TRUE;

    exit:
    free(pPoints2Hash);
    free(pPoints2HashHex);

    return b;
}

BOOL ProofEqualityOfDL(const unsigned char *p_x,
                       const unsigned char *p_G1Compressed, // 32 + 1 bytes
                       const unsigned char *p_Y1Compressed, // 32 + 1 bytes
                       const unsigned char *p_G2Compressed, // 32 + 1 bytes
                       const unsigned char *p_Y2Compressed, // 32 + 1 bytes
                       unsigned char *p_w,
                       unsigned char *p_U1Compressed,       // 32 + 1 bytes
                       unsigned char *p_U2Compressed)       // 32 + 1 bytes
{
    BOOL b = TRUE;
    int err;
    BN_CTX *ctx;
    BIGNUM *pbn_w, *pbn_q, *pbn_x, *pbn_v, *pbn_u, *pbn_x_mult_v;

    initContexts();

    unsigned char p_Data2Hash[2 * 6 * (GF_LEN + 1)];
    unsigned char p_v[GF_LEN];

    unsigned char p_u[GF_LEN];
//    unsigned char p_u[GF_LEN]; = {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
//                                 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
//                                 0x00, 0x00, 0x00, 0x01};


    ctx = BN_CTX_new();
    pbn_x = BN_new();
    pbn_q = BN_new();
    pbn_v = BN_new();
    pbn_w = BN_new();
    pbn_u = BN_new();
    pbn_x_mult_v = BN_new();

    b = CryptGenRandom(hProv, GF_LEN, p_u);
    if (!b) {
        goto exit;
    }

    b = ScalarMultCompressed(p_u, p_G1Compressed, p_U1Compressed);
    if (!b) {
        goto exit;
    }

    b = ScalarMultCompressed(p_u, p_G2Compressed, p_U2Compressed);
    if (!b) {
        goto exit;
    }


    memcpy(p_Data2Hash, p_U1Compressed, GF_LEN + 1);

    memcpy(p_Data2Hash + (GF_LEN + 1), p_U2Compressed, GF_LEN + 1);

    memcpy(p_Data2Hash + 2 * (GF_LEN + 1), p_G1Compressed, GF_LEN + 1);

    memcpy(p_Data2Hash + 3 * (GF_LEN + 1), p_Y1Compressed, GF_LEN + 1);

    memcpy(p_Data2Hash + 4 * (GF_LEN + 1), p_G2Compressed, GF_LEN + 1);

    memcpy(p_Data2Hash + 5 * (GF_LEN + 1), p_Y2Compressed, GF_LEN + 1);

    toLower(p_Data2Hash, (GF_LEN + 1) * 2 * 6);

    b = HashCompresedPointsBE(p_Data2Hash, 6, p_v);
    if (!b) {
        goto exit;
    }

    BN_bin2bn(order_bin, GF_LEN, pbn_q);

    BN_bin2bn(p_x, GF_LEN, pbn_x);
    BN_bin2bn(p_v, GF_LEN, pbn_v);
    BN_lebin2bn(p_u, GF_LEN, pbn_u);

    err = BN_mod_mul(pbn_x_mult_v, pbn_x, pbn_v, pbn_q, ctx);


    if (err != 1) {
        b = FALSE;
        goto exit;
    }

    err = BN_mod_add(pbn_w, pbn_x_mult_v, pbn_u, pbn_q, ctx);
    if (err != 1) {
        b = FALSE;
        goto exit;
    }

    err = BN_bn2binpad(pbn_w, p_w, GF_LEN);
    if (err != GF_LEN) {
        b = FALSE;
        goto exit;
    }

    exit:
    BN_free(pbn_x);
    BN_free(pbn_q);
    BN_free(pbn_v);
    BN_free(pbn_w);
    BN_free(pbn_u);

    BN_CTX_free(ctx);

    return b;
}

BOOL IsPubKeysEqual(HCRYPTKEY hKey1, HCRYPTKEY hKey2) {
    unsigned char pbKeyBlob1[29 + 2 * GF_LEN];
    unsigned char pbKeyBlob2[29 + 2 * GF_LEN];
    DWORD dwBlobLen = sizeof(pbKeyBlob1);

    if (!CryptExportKey(hKey1, 0, PUBLICKEYBLOB, 0, pbKeyBlob1, &dwBlobLen))
        return FALSE;

    if (!CryptExportKey(hKey2, 0, PUBLICKEYBLOB, 0, pbKeyBlob2, &dwBlobLen))
        return FALSE;

    if (memcmp(pbKeyBlob2, pbKeyBlob1, dwBlobLen))
        return FALSE;
    else
        return TRUE;
}

int VerifyEqualityOfDL(const EC_GROUP *pCurve,
                       const BIGNUM *pbn_w,
                       const unsigned char *pHash,
                       EC_POINT *pU1,
                       EC_POINT *pU2,
                       EC_POINT *pG1,
                       EC_POINT *pY1,
                       EC_POINT *pG2,
                       EC_POINT *pY2) {
    int err = 1;
    BN_CTX *ctx;
    BIGNUM *pbn_q, *pbn_hash;
    EC_POINT *pp_Points[] = {pU1, pU2, pG1, pY1, pG2, pY2};
    EC_POINT *pwG, *phashY, *phashYplusU;

    pbn_q = BN_new();
    pbn_hash = BN_new();

    ctx = BN_CTX_new();

    pwG = EC_POINT_new(pCurve);
    phashY = EC_POINT_new(pCurve);
    phashYplusU = EC_POINT_new(pCurve);

    err = EC_GROUP_get_order(pCurve, pbn_q, ctx);
    if (err != 1)
        goto exit;


    BN_bin2bn(pHash, GF_LEN, pbn_hash);



    // First, check that w*G1 == hash*Y1 + U1:

    // w*G1:
    err = EC_POINT_mul(pCurve, pwG, NULL, pG1, pbn_w, ctx);
    if (err != 1)
        goto exit;


    // hash*Y1:
    err = EC_POINT_mul(pCurve, phashY, NULL, pY1, pbn_hash, ctx);
    if (err != 1)
        goto exit;

    // hash*Y1 + U1:
    err = EC_POINT_add(pCurve, phashYplusU, phashY, pU1, ctx);
    if (err != 1)
        goto exit;

    err = EC_POINT_cmp(pCurve, pwG, phashYplusU, ctx);
    if (err != 0) // points are not equal
    {
        err = 0;
        goto exit;
    }

    // Second, check that w*G2 == hash*Y2 + U2:

    // w*G2:
    err = EC_POINT_mul(pCurve, pwG, NULL, pG2, pbn_w, ctx);
    if (err != 1)
        goto exit;

    // hash*Y2:
    err = EC_POINT_mul(pCurve, phashY, NULL, pY2, pbn_hash, ctx);
    if (err != 1)
        goto exit;

    // hash*Y2 + U2:
    err = EC_POINT_add(pCurve, phashYplusU, phashY, pU2, ctx);
    if (err != 1)
        goto exit;

    err = EC_POINT_cmp(pCurve, pwG, phashYplusU, ctx);
    if (err != 0) // points are not equal
    {
        err = 0;
        goto exit;
    }


    err = 1; // Ok

    exit:

    EC_POINT_free(pwG);
    EC_POINT_free(phashY);
    EC_POINT_free(phashYplusU);

    BN_free(pbn_hash);
    BN_free(pbn_q);
    BN_CTX_free(ctx);

    return err;
}


int CreateECPoint(const EC_GROUP *pCurve, const unsigned char *compressed, EC_POINT *Result) {
    int err = 1;
    unsigned char x[GF_LEN];
    unsigned char flag;
    for (unsigned int i = 0; i < GF_LEN; i++) {
        x[i] = compressed[i + 1];
    }


    flag = getFlag(compressed);

    err = binBE2EC_POINTCompressed(pCurve, x, flag, Result);
    return err;
}

BOOL VerifyEqualityOfDLOpenSSL(
        const unsigned char *p_w,
        const unsigned char *p_U1,
        const unsigned char *p_U2,
        const unsigned char *p_G1,
        const unsigned char *p_Y1,
        const unsigned char *p_G2,
        const unsigned char *p_Y2) {
    int err = 1;
    EC_GROUP *pCurve;
    BIGNUM *pbn_w;
    EC_POINT *pU1, *pU2, *pG1, *pY1, *pG2, *pY2;


    pCurve = create_curve();

    if (NULL == pCurve) {
        err = 0;
        goto exit;
    }

    pU1 = EC_POINT_new(pCurve);
    pU2 = EC_POINT_new(pCurve);
    pG1 = EC_POINT_new(pCurve);
    pY1 = EC_POINT_new(pCurve);
    pG2 = EC_POINT_new(pCurve);
    pY2 = EC_POINT_new(pCurve);

    CreateECPoint(pCurve, p_U1, pU1);
    CreateECPoint(pCurve, p_U2, pU2);
    CreateECPoint(pCurve, p_G1, pG1);
    CreateECPoint(pCurve, p_Y1, pY1);
    CreateECPoint(pCurve, p_G2, pG2);
    CreateECPoint(pCurve, p_Y2, pY2);

    pbn_w = BN_new();
    BN_bin2bn(p_w, GF_LEN, pbn_w);

    unsigned char p_Data2Hash[2 * 6 * (GF_LEN + 1)];
    unsigned char pHash[GF_LEN];


    memcpy(p_Data2Hash, p_U1, GF_LEN + 1);

    memcpy(p_Data2Hash + (GF_LEN + 1), p_U2, GF_LEN + 1);

    memcpy(p_Data2Hash + 2 * (GF_LEN + 1), p_G1, GF_LEN + 1);

    memcpy(p_Data2Hash + 3 * (GF_LEN + 1), p_Y1, GF_LEN + 1);

    memcpy(p_Data2Hash + 4 * (GF_LEN + 1), p_G2, GF_LEN + 1);

    memcpy(p_Data2Hash + 5 * (GF_LEN + 1), p_Y2, GF_LEN + 1);

    toLower(p_Data2Hash, (GF_LEN + 1) * 2 * 6);


    err = (int) HashCompresedPointsBE(p_Data2Hash, 6, pHash);
    if (!err)
        goto exit;

    err = VerifyEqualityOfDL(pCurve,
                             pbn_w,
                             pHash,
                             pU1,
                             pU2,
                             pG1,
                             pY1,
                             pG2,
                             pY2);


    exit:
    BN_free(pbn_w);
    EC_POINT_free(pU1);
    EC_POINT_free(pU2);
    EC_POINT_free(pG1);
    EC_POINT_free(pY1);
    EC_POINT_free(pG2);
    EC_POINT_free(pY2);

    EC_GROUP_free(pCurve);
    if (err == 1) {
        return TRUE;
    } else {
        return FALSE;
    }
}

int Point2HexCompressedEx(const unsigned char *p_Bx, unsigned char flagB, char *psz_Point) {
    int err = 1;
    char pPoint[2 * (1 + GF_LEN) + 1];
    char szHexByte[3];

    if (flagB == 0)
        strcpy(pPoint, "02");
    else
        strcpy(pPoint, "03");

    for (int i = 0; i < GF_LEN; i++) {
        sprintf(szHexByte, "%02X", p_Bx[i]);
        strcat(pPoint, szHexByte);
    }

    strcpy(psz_Point, toLower(pPoint, 2 * (1 + GF_LEN)));
    return err;
}

BOOL AddOrSubtractPointsCryptoPro(HCRYPTKEY hKey1, HCRYPTKEY hKey2, DWORD dwAddFlag) {
    BOOL b = TRUE;
    HCRYPTKEY hAddHandle;
    DWORD dwHandleSize = sizeof(hAddHandle);
    CRYPT_DATA_BLOB cdbNum;

    b = CryptGetKeyParam(hKey2, KP_HANDLE, (BYTE *) &hAddHandle, &dwHandleSize, 0);
    if (!b)
        return FALSE;

    cdbNum.cbData = dwHandleSize;
    cdbNum.pbData = (BYTE *) &hAddHandle;

    b = CryptSetKeyParam(hKey1, KP_ADDX, (BYTE *) &cdbNum, dwAddFlag | CP_CRYPT_DATA_HANDLE);
    if (!b)
        return FALSE;

    return b;
}

BOOL AddPointsCryptoPro(HCRYPTKEY hKey1, HCRYPTKEY hKey2) {
    return AddOrSubtractPointsCryptoPro(hKey1, hKey2, EC_PLUS);
}


// hKey1 + hKey2 -> hKey1
BOOL SubPointsCryptoPro(HCRYPTKEY hKey1, HCRYPTKEY hKey2) {
    return AddOrSubtractPointsCryptoPro(hKey1, hKey2, EC_MINUS);
}

BOOL ImportPointCompressedLe(HCRYPTPROV hProv, const unsigned char *p_X, unsigned char ubOddFlag, HCRYPTKEY *phKey);

BOOL ImportPointCompressedBe(HCRYPTPROV hProv, const unsigned char *p_X, unsigned char ubOddFlag, HCRYPTKEY *phKey);

BOOL ScalarMultCompressed2(HCRYPTPROV hProv, const unsigned char *p_Num, const unsigned char *p_Point,
                           unsigned char *p_ResultPoint) {
    BOOL bOK;
    HCRYPTKEY hKey;
    unsigned char pbKeyBlob[PUB_BLOB_EXPORT_COMPRESSED_LEN];
    DWORD dwBlobLen = PUB_BLOB_EXPORT_COMPRESSED_LEN;

    const char *oid = szOID_tc26_gost_3410_12_256_paramSetB;

    const unsigned char pBaseCompressed[32 + 1] = {
            0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x02
    };

    // Зададим множитель m как байтовую строку в LE
    BYTE bNum[32];
    CRYPT_DATA_BLOB cdbNum = {0x20, bNum};

    memcpy(cdbNum.pbData, p_Num, 32);


    bOK = CryptSetProvParam(hProv, PP_DHOID, (BYTE *) oid, 0);
    if (!bOK)
        return FALSE;

    if (!p_Point)
        p_Point = pBaseCompressed;

    bOK = ImportPointCompressedLe(hProv, p_Point, p_Point[32], &hKey);
    if (!bOK)
        return FALSE;


// Получим в hKey ( (m * sk) mod q, m * pk)

    bOK = CryptSetKeyParam(hKey, KP_MULX, (BYTE *) &cdbNum, 0);
    if (!bOK) {
        return FALSE;
    }

    //--------------------------------------------------------------------
    // Экспортирование открытого ключа получателя в BLOB открытого ключа.

    if (!CryptExportKey(
            hKey,
            0,
            PUBLICKEYBLOB,
            CRYPT_PUBLICCOMPRESS,
            pbKeyBlob,
            &dwBlobLen)) {
        return FALSE;
    }

    memcpy(p_ResultPoint, pbKeyBlob + 29, 32 + 1);

    /////////////////////////////////////////////////////////////////////////////////////

    // освобождаем память
    bOK = CryptDestroyKey(hKey);
    if (!bOK)
        return FALSE;

    return bOK;
}

BOOL ScalarMultCompressedBe(HCRYPTPROV hProv, const unsigned char *p_Num, const unsigned char *p_Point,
                            unsigned char ubPointFlag, unsigned char *p_ResultPoint, unsigned char *ubResultPointFlag) {
    BOOL b;

    unsigned char pPointLe[GF_LEN + 1];
    unsigned char pResultPointLe[GF_LEN + 1];
    unsigned char pNumLe[GF_LEN];

    memcpy(pNumLe, p_Num, GF_LEN);
    reverseBytes(pNumLe, GF_LEN);


    if (p_Point) {
        memcpy(pPointLe, p_Point, GF_LEN);
        reverseBytes(pPointLe, GF_LEN);
        pPointLe[GF_LEN] = ubPointFlag;

        b = ScalarMultCompressed2(hProv, pNumLe, pPointLe, pResultPointLe);
    } else
        b = ScalarMultCompressed2(hProv, pNumLe, NULL, pResultPointLe);

    if (!b)
        return b;

    memcpy(p_ResultPoint, pResultPointLe, GF_LEN);
    reverseBytes(p_ResultPoint, GF_LEN);

    *ubResultPointFlag = pResultPointLe[GF_LEN];

    return b;
}


BOOL ScalarMultCompressedH(HCRYPTPROV hProv, const unsigned char *p_Num, HCRYPTKEY hKey) {
    BOOL bOK;

    const char *oid = szOID_tc26_gost_3410_12_256_paramSetB;

    // Зададим множитель m как байтовую строку в LE
    BYTE bNum[GF_LEN];
    CRYPT_DATA_BLOB cdbNum = {0x20, bNum};

    memcpy(cdbNum.pbData, p_Num, GF_LEN);


    bOK = CryptSetProvParam(hProv, PP_DHOID, (BYTE *) oid, 0);
    if (!bOK)
        return FALSE;

// Получим в hKey ( (m * sk) mod q, m * pk)

    bOK = CryptSetKeyParam(hKey, KP_MULX, (BYTE *) &cdbNum, 0);
    if (!bOK) {
        return FALSE;
    }

    return bOK;
}

BOOL ScalarMultCompressedBe2Handle(HCRYPTPROV hProv, const unsigned char *p_Num, const unsigned char *p_Point,
                                   unsigned char ubPointFlag, HCRYPTKEY *phKey) {
    BOOL b;
    unsigned char pResultX[GF_LEN];
    unsigned char flagResult;

    b = ScalarMultCompressedBe(hProv, p_Num, p_Point, ubPointFlag, pResultX, &flagResult);
    if (!b)
        return b;

    b = ImportPointCompressedBe(hProv, pResultX, flagResult, phKey);

    return b;
}

// ubOddFlag = 3 if odd and 2 if even
BOOL ImportPointCompressedLe(HCRYPTPROV hProv, const unsigned char *p_X, unsigned char ubOddFlag, HCRYPTKEY *phKey) {
    BOOL bOK;

    unsigned char pPubKeyBlobCompressed[29 + 32 + 1] = {
            0x06, 0x20, 0x00, 0x00, 0x49, 0x2E, 0x00, 0x00, 0x4D, 0x41, 0x47, 0x31, 0x08, 0x01, 0x00, 0x00,
            0x30, 0x0B, 0x06, 0x09, 0x2A, 0x85, 0x03, 0x07, 0x01, 0x02, 0x01, 0x01, 0x02,};

    memcpy(pPubKeyBlobCompressed + 29, p_X, 32);

    pPubKeyBlobCompressed[29 + 32] = ubOddFlag;

    bOK = CryptImportKey(hProv, pPubKeyBlobCompressed, sizeof(pPubKeyBlobCompressed), 0, PUBLICKEYBLOB, phKey);
    if (!bOK)
        return FALSE;

    return bOK;
}

BOOL ImportPointCompressedBe(HCRYPTPROV hProv, const unsigned char *p_X, unsigned char ubOddFlag, HCRYPTKEY *phKey) {
    BOOL bOK;
    unsigned char p_XLe[GF_LEN];

    memcpy(p_XLe, p_X, GF_LEN);
    reverseBytes(p_XLe, GF_LEN);

    bOK = ImportPointCompressedLe(hProv, p_XLe, ubOddFlag, phKey);

    return bOK;
}

int VerifyRangeProofExCompressedCryptoPro(
        const unsigned char *p_PubKeyx, unsigned char flagPubKey,
        const unsigned int *p_all_messages,
        const unsigned int num_of_messages,
        const unsigned char *p_Ax, unsigned char flagA,
        const unsigned char *p_Bx, unsigned char flagB,
        const unsigned char *p_Asx, const unsigned char *p_flagAs,
        const unsigned char *p_Bsx, const unsigned char *p_flagBs,
        const unsigned char *p_c,
        const unsigned char *p_rss) {
    unsigned long err = 1;
    BIGNUM *pbn_c_sum = NULL, *pbn_c_i = NULL, *pbn_rss_i = NULL, *pbn_hash = NULL, *pbn_all_messages_i = NULL, *pbn_q = NULL;

    unsigned char pHash[GF_LEN];

    BN_CTX *ctx = NULL;

    HCRYPTHASH hHash = 0;
    DWORD dwHashLen = GF_LEN;

    HCRYPTKEY hKeyA1 = 0;
    HCRYPTKEY hKeyA2 = 0;
    HCRYPTKEY hKeyAs_i = 0;

    HCRYPTKEY hKeyB = 0;
    HCRYPTKEY hKeyB1 = 0;
    HCRYPTKEY hKeyB2 = 0;
    HCRYPTKEY hKeyB_s_i = 0;

    char pszPointCompressed[2 + 2 * GF_LEN + 1];

    ctx = BN_CTX_new();

    pbn_q = BN_bin2bn(order_bin, sizeof(order_bin), NULL);
    if (NULL == pbn_q) {
        err = 0;
        goto exit;
    }

    initContexts();

    if (!CryptCreateHash(hProv, CALG_GR3411_2012_256, 0, 0, &hHash))
        goto exit;

    pbn_c_sum = BN_new();
    pbn_c_i = BN_new();
    pbn_rss_i = BN_new();
    pbn_hash = BN_new();
    pbn_all_messages_i = BN_new();

    BN_zero(pbn_c_sum);

    err = Point2HexCompressedEx(p_PubKeyx, flagPubKey, pszPointCompressed);
    if (err != 1)
        goto exit;

    //gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN);
    if (!CryptHashData(hHash, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN, 0))
        goto exit;

    err = Point2HexCompressedEx(p_Ax, flagA, pszPointCompressed);
    if (err != 1)
        goto exit;

    //gost2012_hash_block(&gost_ctx, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN);
    if (!CryptHashData(hHash, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN, 0))
        goto exit;

    err = Point2HexCompressedEx(p_Bx, flagB, pszPointCompressed);
    if (err != 1)
        goto exit;

    if (!CryptHashData(hHash, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN, 0))
        goto exit;

    for (unsigned int i = 0; i < num_of_messages; i++) {

        Point2HexCompressedEx(p_Asx + i * GF_LEN, p_flagAs[i], pszPointCompressed);

        if (!CryptHashData(hHash, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN, 0))
            goto exit;
    }

    for (unsigned int i = 0; i < num_of_messages; i++) {

        Point2HexCompressedEx(p_Bsx + i * GF_LEN, p_flagBs[i], pszPointCompressed);

        if (!CryptHashData(hHash, (unsigned char *) pszPointCompressed, 2 + 2 * GF_LEN, 0))
            goto exit;
    }

    if (!CryptGetHashParam(hHash, HP_HASHVAL, pHash, &dwHashLen, 0))
        goto exit;


    for (unsigned int i = 0; i < num_of_messages; i++) {

        BN_bin2bn(p_c + i * GF_LEN, GF_LEN, pbn_c_i);
        BN_mod_add(pbn_c_sum, pbn_c_sum, pbn_c_i, pbn_q, ctx);

        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        // r_ss[i]*Base == A_s[i] + c_[i]*A


        // A1 = r_ss[i]*Base

        err = ScalarMultCompressedBe2Handle(hProv, p_rss + i * GF_LEN, NULL, 0, &hKeyA1);
        if (err != 1)
            goto exit;

        err = ScalarMultCompressedBe2Handle(hProv, p_c + i * GF_LEN, p_Ax, flagA + 2, &hKeyA2);
        if (err != 1)
            goto exit;

        err = ImportPointCompressedBe(hProv, p_Asx + i * GF_LEN, p_flagAs[i] + 2, &hKeyAs_i);
        if (err != 1)
            goto exit;

        err = AddPointsCryptoPro(hKeyA2, hKeyAs_i);
        if (err != 1)
            goto exit;

        err = IsPubKeysEqual(hKeyA2, hKeyA1);
        if (err != 1)
            goto exit;

        CryptDestroyKey(hKeyA1);
        CryptDestroyKey(hKeyA2);
        CryptDestroyKey(hKeyAs_i);

        hKeyA1 = 0;
        hKeyA2 = 0;
        hKeyAs_i = 0;


        ///////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////
        // r_ss[i]*PubKey == B_s[i] + c_[i]*(B - all_messages[i]*Base)

        // r_ss[i]*PubKey :

        err = ScalarMultCompressedBe2Handle(hProv, p_rss + i * GF_LEN, p_PubKeyx, flagPubKey + 2, &hKeyB1);
        if (err != 1)
            goto exit;

        // B_s[i]:
        err = ImportPointCompressedBe(hProv, p_Bsx + i * GF_LEN, p_flagBs[i] + 2, &hKeyB_s_i);
        if (err != 1)
            goto exit;

        err = ImportPointCompressedBe(hProv, p_Bx, flagB + 2, &hKeyB);
        if (err != 1)
            goto exit;

        // all_messages[i]*Base :

        BN_set_word(pbn_all_messages_i, p_all_messages[i]);
        unsigned char t3[GF_LEN];
        BN_bn2binpad(pbn_all_messages_i, t3, GF_LEN);


        if (p_all_messages[i] != 0) {

            err = ScalarMultCompressedBe2Handle(hProv, t3, NULL, 0, &hKeyB2);
            if (err != 1)
                goto exit;

            err = SubPointsCryptoPro(hKeyB, hKeyB2);
            if (err != 1)
                goto exit;

            CryptDestroyKey(hKeyB2);
            hKeyB2 = 0;
        }

        //c_[i]*(B - all_messages[i]*Base)

        unsigned char pc_i[GF_LEN];
        memcpy(pc_i, p_c + i * GF_LEN, GF_LEN);
        reverseBytes(pc_i, GF_LEN);

        err = ScalarMultCompressedH(hProv, pc_i, hKeyB);
        if (err != 1)
            goto exit;

        // B_s[i] + c_[i]*(B - all_messages[i]*Base)

        err = AddPointsCryptoPro(hKeyB_s_i, hKeyB);
        if (err != 1)
            goto exit;

        if (!IsPubKeysEqual(hKeyB1, hKeyB_s_i)) {
            err = 0;
            goto exit;
        }

        CryptDestroyKey(hKeyB1);
        CryptDestroyKey(hKeyB);
        CryptDestroyKey(hKeyB_s_i);

        hKeyB1 = 0;
        hKeyB = 0;
        hKeyB_s_i = 0;

    }

    BN_bin2bn(pHash, GF_LEN, pbn_hash);

    BN_mod(pbn_hash, pbn_hash, pbn_q, ctx);

    if (BN_cmp(pbn_hash, pbn_c_sum)) {
        err = 0;
        goto exit;
    }

    exit:
    BN_free(pbn_c_sum);
    BN_free(pbn_c_i);
    BN_free(pbn_rss_i);
    BN_free(pbn_hash);
    BN_free(pbn_all_messages_i);
    BN_free(pbn_q);

    BN_CTX_free(ctx);

    if (hHash)
        CryptDestroyHash(hHash);
    if (hKeyA1)
        CryptDestroyKey(hKeyA1);
    if (hKeyA2)
        CryptDestroyKey(hKeyA2);
    if (hKeyAs_i)
        CryptDestroyKey(hKeyAs_i);

    if (hKeyB)
        CryptDestroyKey(hKeyB);
    if (hKeyB1)
        CryptDestroyKey(hKeyB1);
    if (hKeyB2)
        CryptDestroyKey(hKeyB2);
    if (hKeyB_s_i)
        CryptDestroyKey(hKeyB_s_i);

//    err = CryptReleaseContext(hProv, 0);

    return err;
}


BOOL VerifyGost3410SignatureLe(const unsigned char *p_Signature, const unsigned char *p_PubKey,
                               const unsigned char *pMessage, unsigned int uiMessageLen) {
    BOOL bOK;
    HCRYPTKEY hPubKey = 0;
    HCRYPTHASH hHash = 0;

    unsigned char pPubKeyBlob[
            29 + 64] = {0x06, 0x20, 0x00, 0x00, 0x49, 0x2E, 0x00, 0x00, 0x4D, 0x41, 0x47, 0x31, 0x00, 0x02, 0x00, 0x00,
                        0x30, 0x0B, 0x06, 0x09, 0x2A, 0x85, 0x03, 0x07, 0x01, 0x02, 0x01, 0x01, 0x02,};

    memcpy(pPubKeyBlob + 29, p_PubKey, 64);

    initContexts();

    bOK = CryptImportKey(hProv, pPubKeyBlob, sizeof(pPubKeyBlob), 0, PUBLICKEYBLOB, &hPubKey);
    if (!bOK)
        goto exit;

    bOK = CryptCreateHash(
            hProv,
            CALG_GR3411_2012_256,
            0,
            0,
            &hHash);
    if (!bOK)
        goto exit;

    //--------------------------------------------------------------------
    // Вычисление криптографического хэша буфера.

    bOK = CryptHashData(
            hHash,
            pMessage,
            uiMessageLen,
            0);
    if (!bOK)
        goto exit;
    //--------------------------------------------------------------------
    // Проверка цифровой подписи.

    bOK = CryptVerifySignature(
            hHash,
            p_Signature,
            2 * GF_LEN,
            hPubKey,
            NULL,
            0);
    if (!bOK)
        goto exit;

    exit:

    if (hPubKey)
        CryptDestroyKey(hPubKey);
    if (hHash)
        CryptDestroyHash(hHash);

    return bOK;
}

BOOL VerifyGost3410SignatureBE(const unsigned char *p_Signature, const unsigned char *p_PubKey,
                               const unsigned char *pMessage, unsigned int uiMessageLen) {
    unsigned char p_Signature_LE[GF_LEN * 2];
    unsigned char p_Message_LE[uiMessageLen];

    memcpy(p_Signature_LE, p_Signature, 64);
    memcpy(p_Message_LE, pMessage, uiMessageLen);

    reverseBytes(p_Signature_LE, 64);


    return VerifyGost3410SignatureLe(p_Signature_LE, p_PubKey, pMessage, uiMessageLen);
}


int main() {


    int err;
    char pPrivKey[65];
    char pPubX[65];
    char pPubY[65];
    int positive_test = 1;
    //  unsigned char pBuff[] = {0, 0, 1, 2};

    //  BIGNUM *pbn_Buff = BN_new();

    init_ssl();
    for (int i = 0; i < 1; i++) {
        err = testRangeProofCompressed(positive_test);
        if (err == 0) {
            printf("testRangeProofCompressed() failed !!\n");
            return 0;
        } else {
            printf("\n test %d ", i);
            printf("testRangeProofCompressed() OK.\n");
        }
    }
    print_time();

    return 0;


}
