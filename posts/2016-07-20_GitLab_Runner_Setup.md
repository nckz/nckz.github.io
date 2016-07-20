(((
Title: GitLab Runner Setup
Date: 2016-07-20 10:46:00
Author: Nicholas Zwart
Summary: Quick notes on setting up a Gitlab Runner.
)))

# Linux 

## Summary
This setup is for a virtual machine running Ubuntu 64bit (15.10, headless) in
conjuction with the cloud version of gitlab using their free 'coordinator'.
The virtual machine is behind a firewall and runs on a host with VM-Workstation
Player 12 running Ubuntu 64bit (12.04, headless).

## Steps

### 1. Install Gitlab Runner on the VM
From the instructions on
[gitlab.com](https://gitlab.com/gitlab-org/gitlab-ci-multi-runner/blob/master/docs/install/linux-repository.md)
Run the following commands:

```bash
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-ci-multi-runner/script.deb.sh | sudo bash
sudo apt-get install gitlab-ci-multi-runner
sudo gitlab-ci-multi-runner register
```

The runner registration info can be found on under the 'runners' tab from in
the desired project:
```
https://gitlab.com/<group>/<repo>/runners
```

This basically says to enter:
Specify the following URL during runner setup: 
```
https://gitlab.com/ci
```
Use the following registration token during setup:
```
<some alpha numeric token to copy and paste>
```

The next questions are for identification of the runner (from the web
interface) and some tags that explain what the runner is good for.  In this
case, its for a GPI node compilation:
```
Please enter the gitlab-ci description for this runner:
[gpilab]: ubuntu64
Please enter the gitlab-ci tags for this runner (comma separated):
gpi,python3
```

Since the compilation is not very complicated I assumed a shell environment
would be sufficient for this -since I hadn't built the script yet.
```
Please enter the executor: ssh, virtualbox, docker+machine, docker-ssh+machine, docker, docker-ssh, parallels, shell:
shell
```

The runner should be auto-started.

