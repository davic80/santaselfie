# Web estática servida con nginx. Los mp3 se generan antes con
# ./scripts/fetch-sounds.sh y se copian en la imagen.
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/
EXPOSE 80
