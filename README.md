## ZeroMQ

### C

- Install libzmq (Ubuntu 22.04 stable):

```
echo 'deb http://download.opensuse.org/repositories/network:/messaging:/zeromq:/git-stable/xUbuntu_22.04/ /' | sudo tee /etc/apt/sources.list.d/network:messaging:zeromq:git-stable.list

curl -fsSL https://download.opensuse.org/repositories/network:messaging:zeromq:git-stable/xUbuntu_22.04/Release.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/network_messaging_zeromq_git-stable.gpg > /dev/null

sudo apt update

sudo apt install libzmq3-dev
```

- Compile program: ```gcc -o program program.c -lzmq```

### Javascript

```yarn add zeromq```
```yarn init -y```