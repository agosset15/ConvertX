FROM debian:trixie-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
  curl \
  unzip \
  git \
  ca-certificates \
  build-essential \
  assimp-utils \
  calibre \
  dasel \
  dcraw \
  dvisvgm \
  ffmpeg \
  ghostscript \
  graphicsmagick \
  imagemagick-7.q16 \
  inkscape \
  latexmk \
  libheif-examples \
  libjxl-tools \
  libreoffice \
  libva2 \
  libvips-tools \
  libemail-outlook-message-perl \
  lmodern \
  mupdf-tools \
  pandoc \
  poppler-utils \
  potrace \
  python3-numpy \
  resvg \
  texlive \
  texlive-fonts-recommended \
  texlive-latex-extra \
  texlive-latex-recommended \
  texlive-xetex \
  texlive-fonts-extra \
  texlive-lang-english \
  texlive-lang-cyrillic \
  cabextract \
  wget \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

RUN ARCH=$(uname -m) && \
  if [ "$ARCH" = "aarch64" ]; then \
  curl -fsSL -o bun-linux-aarch64.zip https://github.com/oven-sh/bun/releases/download/bun-v1.2.2/bun-linux-aarch64.zip; \
  else \
  curl -fsSL -o bun-linux-x64-baseline.zip https://github.com/oven-sh/bun/releases/download/bun-v1.2.2/bun-linux-x64-baseline.zip; \
  fi && \
  unzip -j bun-linux-*.zip -d /usr/local/bin && \
  rm bun-linux-*.zip && \
  chmod +x /usr/local/bin/bun

RUN ARCH=$(uname -m) && \
  if [ "$ARCH" = "aarch64" ]; then \
  VTRACER_ASSET="vtracer-aarch64-unknown-linux-musl.tar.gz"; \
  else \
  VTRACER_ASSET="vtracer-x86_64-unknown-linux-musl.tar.gz"; \
  fi && \
  curl -L -o /tmp/vtracer.tar.gz "https://github.com/visioncortex/vtracer/releases/download/0.6.4/${VTRACER_ASSET}" && \
  tar -xzf /tmp/vtracer.tar.gz -C /tmp/ && \
  mv /tmp/vtracer /usr/local/bin/vtracer && \
  chmod +x /usr/local/bin/vtracer && \
  rm /tmp/vtracer.tar.gz

RUN curl -L -o /tmp/master.zip "https://github.com/mreq/xelatex-emoji/archive/refs/heads/master.zip" && \
  unzip /tmp/master.zip -d /usr/share/texmf/tex/latex && \
  texhash && rm /tmp/master.zip

RUN curl -L -o /tmp/master.zip "https://github.com/joypixels/emojione-assets/archive/refs/heads/master.zip" && \
  unzip /tmp/master.zip -d /tmp && mkdir /usr/share/texmf/tex/latex/xelatex-emoji-master/images && \
  cp -r /tmp/emojione-assets-master/png/128/* /usr/share/texmf/tex/latex/xelatex-emoji-master/images/ && \
  rm /tmp/master.zip && rm -r /tmp/emojione-assets-master

RUN curl -L -o /tmp/EB_Garamond.zip "https://static.ag15.ru/fonts/EB_Garamond.zip" && \
  unzip /tmp/EB_Garamond.zip -d /usr/share/fonts/truetype/EB_Garamond && rm /tmp/EB_Garamond.zip

RUN curl -L -o /tmp/Montserrat.zip "https://static.ag15.ru/fonts/Montserrat.zip" && \
  unzip /tmp/Montserrat.zip -d /usr/share/fonts/truetype/Montserrat && rm /tmp/Montserrat.zip

RUN texhash

RUN mkdir -p data
ENV NODE_ENV=development
ENV QTWEBENGINE_CHROMIUM_FLAGS="--no-sandbox"
EXPOSE 3000
CMD ["bun", "run", "dev"]