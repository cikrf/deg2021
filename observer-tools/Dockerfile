FROM bitnami/node:16-prod as deps
WORKDIR /app
RUN apt update && apt install build-essential python libssl-dev openssl lsb-base --yes
COPY package.json .
COPY package-lock.json .
RUN npm ci -q

FROM deps as cryptolib
COPY linux-amd64_deb.tgz /app/
COPY lib /app/lib/
WORKDIR /app/
RUN tar -xvf linux-amd64_deb.tgz
WORKDIR /app/linux-amd64_deb
RUN ./install.sh kc1 lsb-cprocsp-devel
WORKDIR /app/lib
ENV LD_LIBRARY_PATH=/opt/cprocsp/lib/amd64
RUN gcc -fPIC -DPIC -Wall -c -g gosthash2012.c curve.c \
    -lpthread -lssl -lcrypto -lssp -lcapi10 -lcapi20 -lrdrsup -L/opt/cprocsp/lib/amd64 \
    -DSIZEOF_VOID_P=8 -DHAVE_LIMITS_H -DUNIX -D_COMPACT -DHAVE_STDINT_H \
    -I/opt/cprocsp/includes -I/opt/cprocsp/include/cpcsp -I/usr/include/openssl/
RUN gcc -shared *.o -o libgostcrypto.so -L/opt/cprocsp/lib/amd64 -lcapi10 -lcapi20 -lssl -lcrypto -lssp  -lrdrsup

FROM deps AS build
WORKDIR /app
COPY tsconfig.build.json tsconfig.build.json
COPY tsconfig.json tsconfig.json
COPY src src
RUN npm run build
RUN npm prune --production

FROM bitnami/node:16-prod
ENV NODE_ENV=production
ENV LD_LIBRARY_PATH=/opt/cprocsp/lib/amd64
WORKDIR /app
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=cryptolib /app/lib /app/lib
COPY --from=cryptolib /opt/cprocsp/ /opt/cprocsp/
COPY --from=cryptolib /app/linux-amd64_deb.tgz /app/linux-amd64_deb.tgz
RUN tar -xvf linux-amd64_deb.tgz
WORKDIR /app/linux-amd64_deb
RUN ./install.sh kc1 lsb-cprocsp-devel
COPY package.json /app
WORKDIR /app
RUN npm i -g .

