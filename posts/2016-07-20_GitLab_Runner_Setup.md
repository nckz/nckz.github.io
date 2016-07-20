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
[gitlab.com](https://gitlab.com/gitlab-org/gitlab-ci-multi-runner/blob/master/docs/install/linux-repository.md),
run the following commands:

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
The 'Shared runners' option was disabled since they likely don't have the
specific requirements for this build, which are maintained internally.

This basically says to enter the free CI 'coordinator' URL:
```
Specify the following URL during runner setup: 
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

...

The runner should be auto-started.
```

This can be verified with:
```bash
ps aux | grep gitlab-runner
```

Which returns something like:
```
root      4355  0.1  0.3  60016 13352 ?        Ssl  10:45   0:01 /usr/bin/gitlab-ci-multi-runner run --working-directory /home/gitlab-runner --config /etc/gitlab-runner/config.toml --service gitlab-runner --syslog --user gitlab-runner
```

### 2. Add the .gitlab-ci.yml to the Project Repo
On the project homepage click the 'Set Up CI' button to add a template
`.gitlab-ci.yml` file to the root directory of the project.  For this, I chose
the Nanoc template since it seemed like a good start.

Changed the job name to the GPI node that was being built and pointed the
`script:` tag to the packaging script that is contained in the root dir of the
repo with reference to the [GitLab Runner
Docs](http://docs.gitlab.com/ce/ci/yaml/README.html#image-and-services).
Switched artifacts to `\*.zip` and the correct build branch.

After commiting the yaml file, I opened the 'Pipelines' to find that the yaml
was invalid due to some unrecognized character. Using the yaml validator at
https://gitlab.com/ci/lint I was able to determine that file globbing must be
done with a regex `/^\*.zip$/`.



