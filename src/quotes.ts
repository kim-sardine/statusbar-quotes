import * as constants from './constants';

interface Quotes
{
    category: string;
    language: string;
    sentences: string[];
}

const quotes: Quotes[] = [
    {
        category: constants.CATEGORY_WISE_SAYING,
        language: constants.LANG_ENGLISH,
        sentences: [
            "If you want to achieve greatness stop asking for permission. - Anonymous",
            "Things work out best for those who make the best of how things work out. - John Wooden",
            "To live a creative life, we must lose our fear of being wrong. - Anonymous",
            "If you are not willing to risk the usual you will have to settle for the ordinary. - Jim Rohn",
            "Trust because you are willing to accept the risk, not because it's safe or certain. - Anonymous",
            "Take up one idea. Make that one idea your life- think of it, dream of it, live on that idea. Let the brain, muscles, nerves, every part of your body, be full of that idea, and just leave every other idea alone. This is the way to success. - Swami Vivekananda",
            "All our dreams can come true if we have the courage to pursue them. - Walt Disney",
            "Good things come to people who wait, but better things come to those who go out and get them. - Anonymous",
            "If you do what you always did, you will get what you always got. - Anonymous",
            "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
            "Just when the caterpillar thought the world was ending, he turned into a butterfly. - Proverb",
            "Successful entrepreneurs are givers and not takers of positive energy. - Anonymous",
            "Whenever you see a successful person you only see the public glories, never the private sacrifices to reach them. - Vaibhav Shah",
            "Opportunities don't happen, you create them. - Chris Grosser",
            "Try not to become a person of success, but rather try to become a person of value. - Albert Einstein",
            "Great minds discuss ideas; average minds discuss events; small minds discuss people. - Eleanor Roosevelt",
            "I have not failed. I've just found 10,000 ways that won't work. - Thomas A. Edison",
            "If you don't value your time, neither will others. Stop giving away your time and talents- start charging for it. - Kim Garst",
            "A successful man is one who can lay a firm foundation with the bricks others have thrown at him. - David Brinkley",
            "No one can make you feel inferior without your consent. - Eleanor Roosevelt",
            "The whole secret of a successful life is to find out what is one's destiny to do, and then do it. - Henry Ford",
            "If you're going through hell keep going. - Winston Churchill",
            "The ones who are crazy enough to think they can change the world, are the ones who do. - Anonymous",
            "Don't raise your voice, improve your argument. - Anonymous",
            "What seems to us as bitter trials are often blessings in disguise. - Oscar Wilde",
            "The meaning of life is to find your gift. The purpose of life is to give it away. - Anonymous",
            "The distance between insanity and genius is measured only by success. - Bruce Feirstein",
            "When you stop chasing the wrong things, you give the right things a chance to catch you. - Lolly Daskal",
            "I believe that the only courage anybody ever needs is the courage to follow your own dreams. - Oprah Winfrey",
            "No masterpiece was ever created by a lazy artist. - Anonymous",
            "Happiness is a butterfly, which when pursued, is always beyond your grasp, but which, if you will sit down quietly, may alight upon you. - Nathaniel Hawthorne",
            "If you can't explain it simply, you don't understand it well enough. - Albert Einstein",
            "Blessed are those who can give without remembering and take without forgetting. - Anonymous",
            "Do one thing every day that scares you. - Anonymous",
            "What's the point of being alive if you don't at least try to do something remarkable. - Anonymous",
            "Life is not about finding yourself. Life is about creating yourself. - Lolly Daskal",
            "Nothing in the world is more common than unsuccessful people with talent. - Anonymous",
            "Knowledge is being aware of what you can do. Wisdom is knowing when not to do it. - Anonymous",
            "Your problem isn't the problem. Your reaction is the problem. - Anonymous",
            "You can do anything, but not everything. - Anonymous",
            "Innovation distinguishes between a leader and a follower. - Steve Jobs",
            "There are two types of people who will tell you that you cannot make a difference in this world: those who are afraid to try and those who are afraid you will succeed. - Ray Goforth",
            "Thinking should become your capital asset, no matter whatever ups and downs you come across in your life. - A.P.J. Abdul Kalam",
            "I find that the harder I work, the more luck I seem to have. - Thomas Jefferson",
            "The starting point of all achievement is desire. - Napoleon Hill",
            "Success is the sum of small efforts, repeated day-in and day-out. - Robert Collier",
            "If you want to achieve excellence, you can get there today. As of this second, quit doing less-than-excellent work. - Thomas J. Watson",
            "All progress takes place outside the comfort zone. - Michael John Bobak",
            "You may only succeed if you desire succeeding; you may only fail if you do not mind failing. - Philippos",
            "Courage is resistance to fear, mastery of fear- not absence of fear. - Mark Twain",
            "Only put off until tomorrow what you are willing to die having left undone. - Pablo Picasso",
            "People often say that motivation doesn't last. Well, neither does bathing- that's why we recommend it daily. - Zig Ziglar",
            "We become what we think about most of the time, and that's the strangest secret. - Earl Nightingale",
            "The only place where success comes before work is in the dictionary. - Vidal Sassoon",
            "Too many of us are not living our dreams because we are living our fears. - Les Brown",
            "I find that when you have a real interest in life and a curious life, that sleep is not the most important thing. - Martha Stewart",
            "It's not what you look at that matters, it's what you see. - Anonymous",
            "The road to success and the road to failure are almost exactly the same. - Colin R. Davis",
            "The function of leadership is to produce more leaders, not more followers. - Ralph Nader",
            "Success is liking yourself, liking what you do, and liking how you do it. - Maya Angelou",
            "As we look ahead into the next century, leaders will be those who empower others. - Bill Gates",
            "A real entrepreneur is somebody who has no safety net underneath them. - Henry Kravis",
            "The first step toward success is taken when you refuse to be a captive of the environment in which you first find yourself. - Mark Caine",
            "People who succeed have momentum. The more they succeed, the more they want to succeed, and the more they find a way to succeed. Similarly, when someone is failing, the tendency is to get on a downward spiral that can even become a self-fulfilling prophecy. - Tony Robbins",
            "When I dare to be powerful, to use my strength in the service of my vision, then it becomes less and less important whether I am afraid. - Audre Lorde",
            "Whenever you find yourself on the side of the majority, it is time to pause and reflect. - Mark Twain",
            "The successful warrior is the average man, with laser-like focus. - Bruce Lee",
            "There is no traffic jam along the extra mile. - Roger Staubach",
            "Develop success from failures. Discouragement and failure are two of the surest stepping stones to success. - Dale Carnegie",
            "If you don't design your own life plan, chances are you'll fall into someone else's plan. And guess what they have planned for you? Not much. - Jim Rohn",
            "If you genuinely want something, don't wait for it- teach yourself to be impatient. - Gurbaksh Chahal",
            "Don't let the fear of losing be greater than the excitement of winning. - Robert Kiyosaki",
            "If you want to make a permanent change, stop focusing on the size of your problems and start focusing on the size of you! - T. Harv Eker",
            "You can't connect the dots looking forward; you can only connect them looking backwards. So you have to trust that the dots will somehow connect in your future. You have to trust in something- your gut, destiny, life, karma, whatever. This approach has never let me down, and it has made all the difference in my life. - Steve Jobs",
            "Two roads diverged in a wood and I  took the one less traveled by, and that made all the difference. - Robert Frost",
            "The number one reason people fail in life is because they listen to their friends, family, and neighbors. - Napoleon Hill",
            "The reason most people never reach their goals is that they don't define them, or ever seriously consider them as believable or achievable. Winners can tell you where they are going, what they plan to do along the way, and who will be sharing the adventure with them. - Denis Waitley",
            "In my experience, there is only one motivation, and that is desire. No reasons or principle contain it or stand against it. - Jane Smiley",
            "Success does not consist in never making mistakes but in never making the same one a second time. - George Bernard Shaw",
            "I don't want to get to the end of my life and find that I lived just the length of it. I want to have lived the width of it as well. - Diane Ackerman",
            "You must expect great things of yourself before you can do them. - Michael Jordan",
            "Motivation is what gets you started. Habit is what keeps you going. - Jim Ryun",
            "People rarely succeed unless they have fun in what they are doing. - Dale Carnegie",
            "There is no chance, no destiny, no fate, that can hinder or control the firm resolve of a determined soul. - Ella Wheeler Wilcox",
            "Our greatest fear should not be of failure but of succeeding at things in life that don't really matter. - Francis Chan",
            "You've got to get up every morning with determination if you're going to go to bed with satisfaction. - George Lorimer",
            "A goal is not always meant to be reached; it often serves simply as something to aim at. -  Bruce Lee",
            "Success is ... knowing your purpose in life, growing to reach your maximum potential, and sowing seeds that benefit others. - John C. Maxwell",
            "Be miserable. Or motivate yourself. Whatever has to be done, it's always your choice. - Wayne Dyer",
            "To accomplish great things, we must not only act, but also dream, not only plan, but also believe. - Anatole France",
            "Most of the important things in the world have been accomplished by people who have kept on trying when there seemed to be no help at all. - Dale Carnegie",
            "You measure the size of the accomplishment by the obstacles you had to overcome to reach your goals. - Booker T. Washington",
            "Real difficulties can be overcome; it is only the imaginary ones that are unconquerable. - Theodore N. Vail",
            "It is better to fail in originality than to succeed in imitation. - Herman Melville",
            "What would you do if you weren't afraid. - Spencer Johnson",
            "Little minds are tamed and subdued by misfortune; but great minds rise above it. - Washington Irving",
            "Failure is the condiment that gives success its flavor. - Truman Capote",
            "Don't let what you cannot do interfere with what you can do. - John R. Wooden",
            "You may have to fight a battle more than once to win it. - Margaret Thatcher",
            "A man can be as great as he wants to be. If you believe in yourself and have the courage, the determination, the dedication, the competitive drive and if you are willing to sacrifice the little things in life and pay the price for the things that are worthwhile, it can be done. - Vince Lombardi",
        ],
    },
    {
        category: constants.CATEGORY_WISE_SAYING,
        language: constants.LANG_KOREAN,
        sentences: [
            "명성을 쌓는 것에는 20년이란 세월이 걸리며 명성을 무너뜨리는 것에는 5분도 걸리지 않는다. 그걸 명심한다면 당신의 행동이 달라질 것이다. - 워렌버핏",
            "간단함이 훌륭함의 열쇠다. - 이소룡",
            "승리하면 조금 배울 수 있고, 패배하면 모든 것을 배울 수 있다. - 크리스티 메튜슨",
            "승자는 책임지는 태도로 살며, 패자는 약속을 남발한다. - 유태경전",
            "말만 하고 행동하지 않는 사람은 잡초로 가득 찬 정원과 같다. - 하우얼",
            "내 자신의 무식을 아는 것은 지식에로의 첫걸음이다. - 바이런",
            "가시에 찔리지 않고서는 장미를 모을 수 없다. - 핀페이",
            "고통을 거치지 않고 얻은 승리는 영광이 아니다. - 나폴레옹",
            "기와한장 아껴서 대들보 썩는다. - 한국속담",
            "바람이 불지 않으면 노를 저어라. - 윈스턴 처칠",
            "강에서 물고기를 보고 탐내는 것보다 돌아가서 그물을 짜는 것이 옳다. - 예악지",
            "역경은 사람을 부유하게 하지는 않으나 지혜롭게 한다. - 풀러",
            "낭비한 시간에 대한 후회는 더 큰 시간 낭비이다. - 메이슨 쿨리",
            "들은 것은 잊어버리고, 본 것은 기억하고 직접 해본 것은 이해한다. - 공자",
            "산을 움직이려 하는 이는 작은 돌을 들어내는 일로 시작한다. - 공자",
            "앞날을 결정짓고자 하면 옛것을 공부하라. - 공자",
            "아이디어의 좋고 나쁨은 어떻게 실행하느냐에 따라 결정된다. - 카를로스 곤",
            "절대 포기하지 마라. 장벽에 부딪히거든, 그것이 절실함을 나에게 물어보는 장치에 불과하다는 것을 잊지 마라. - 랜디 포시",
            "현재와 미래는 어떻게든 연결되어 있다 - 스티브 잡스",
            "모든 기능은 유지비용이 든다. 소수의 기능을 가지는 것은 우리가 정말로 신경쓰는 것에 집중하도록 하고 그것들이 뛰어나도록 만든다. - 데이비드 카프",
            "시도해보지 않고는 누구도 자신이 얼마만큼 해낼 수 있는지 알지 못한다. - 푸블릴리우스 시루스",
            "다리를 움직이지 않고는 작은 도랑도 건널 수 없다. - 알랭",
            "항상 갈구하라. 바보짓을 두려워마라. - 스티브 잡스",
            "비장의 무기는 아직 손안에 있다.그것은 희망이다. - 나폴레옹",
            "성공을 위한 세가지 열쇠는 이것이다. 첫째는 끈기, 둘째는 끈기, 셋째도 끈기. - 이소룡",
            "성공의 커다란 비결은 결코 지치지 않는 인간으로 인생을 살아가는 것이다. - 알버트 슈바이처",
            "나는 그저 나보다 머리가 좋은 사람들을 채용했을 뿐이다. - 록펠러",
            "18년동안 아마존을 성공으로 이끈 3가지 큰 전략이 있다.그것은 고객을 우선 생각하고, 발명하고, 인내하는 것이다. - 제프 베조스",
            "가끔은 혁신을 추구하다 실수할 때도 있다. 하지만 빨리 인정하고 다른 혁신을 개선해 나가는 것이 최선이다. - 스티브 잡스",
            "휴식은 게으름도, 멈춤도 아니다. - 헨리 포드",
        ],
    },
    {
        category: constants.CATEGORY_PROGRAMMING_QUOTES,
        language: constants.LANG_ENGLISH,
        sentences: [
            "A common fallacy is to assume authors of incomprehensible code will be able to express themselves clearly in comments. - Kevlin Henney",
            "A computer is like a violin. You can imagine a novice trying ﬁrst a phonograph and then a violin. The latter, he says, sounds terrible. That is the argument we have heard from our humanists and most of our computer scientists. Computer programs are good, they say, for particular purposes, but they aren’t ﬂexible. Neither is a violin, or a typewriter, until you learn how to use it. - Marvin Minsky",
            "A conscious human is driven by their conscience, not popular opinion. - Suzy Kassem",
            "A distributed system is one in which the failure of a computer you didn’t even know existed can render your own computer unusable. - Leslie Lamport",
            "A language that doesn't affect the way you think about programming is not worth knowing. - Alan J. Perlis",
            "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live - John Woods",
            "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
            "Any sufficiently advanced bug is indistinguishable from a feature - R. Kulawiec",
            "Any sufficiently advanced incompetence is indistinguishable from malice - Grey’s Law",
            "Bad programmers worry about the code. Good programmers worry about data structures and their relationships. - Linus Torvalds",
            "Big Brother fills us all with the same crap. My guess is he was clever the same way everybody thinks they're clever. I tell her to type in 'password - Chuck Palahniuk, Lullaby",
            "C is memory with syntactic sugar. - Dennis Kubes",
            "Dynamic typing: The belief that you can’t explain to a computer why your code works, but you can keep track of it all in your head. - chris martin",
            "Give a man a program, frustrate him for a day. Teach a man to program, frustrate him for a lifetime. - Muhammad Waseem",
            "Give someone a program, you frustrate them for a day; teach them how to program, you frustrate them for a lifetime. - David Leinweber",
            "How you look at it is pretty much how you'll see it - Rasheed Ogunlaru",
            "I think that it’s extraordinarily important that we in computer science keep fun in computing. When it started out it was an awful lot of fun. Of course the paying customers got shafted every now and then and after a while we began to take their complaints seriously. We began to feel as if we really were responsible for the successful error-free perfect use of these machines. I don’t think we are. I think we’re responsible for stretching them setting them off in new directions and keeping fun in the house. I hope the ﬁeld of computer science never loses its sense of fun. Above all I hope we don’t become missionaries. Don’t feel as if you’re Bible sales-men. The world has too many of those already. What you know about computing other people will learn. Don’t feel as if the key to successful computing is only in your hands. What’s in your hands I think and hope is intelligence: the ability to see the machine as more than when you were ﬁrst led up to it that you can make it more. - Alan J. Perlis",
            "If you put a million monkeys on a million keyboards, one of them will eventually write a Java program. The rest of them will write Perl programs.",
            "I'm not a great programmer; I'm just a good programmer with great habits. - Kent Beck",
            "Much of the essence of building a program is in fact the debugging of the specification. - Fred Brooks",
            "Object-oriented programming offers a sustainable way to write spaghetti code. It lets you accrete programs as a series of patches. - Paul Graham, Hackers & Painters: Big Ideas from the Computer Age",
            "On two occasions, I have been asked [by members of Parliament], 'Pray, Mr. Babbage, if you put into the machine wrong figures, will the right answers come out?' I am not able to rightly apprehend the kind of confusion of ideas that could provoke such a question. - Charles Babbage",
            "Perl – The only language that looks the same before and after RSA encryption. - Keith Bostic",
            "Programming today is a race between software engineers striving to build bigger and better idiot-proof programs, and the Universe trying to produce bigger and better idiots. So far, the Universe is winning. - Rick Cook",
            "Programs must be written for people to read, and only incidentally for machines to execute. - Harold Abelson",
            "Punishments include such things as flashbacks, flooding of unbearable emotions, painful body memories, flooding of memories in which the survivor perpetrated against others, self-harm, and suicide attempts. - Alison Miller, Healing the Unimaginable: Treating Ritual Abuse and Mind Control",
            "Remember that code is really the language in which we ultimately express the requirements. We may create languages that are closer to the requirements. We may create tools that help us parse and assemble those requirements into formal structures. But we will never eliminate necessary precision—so there will always be code. - Robert C. Martin",
            "Sufficiently advanced abstractions are indistinguishable from obfuscation. - raganwald",
            "Sufficiently advanced trolling is indistinguishable from thought leadership. - Hall’s Law",
            "Talk is cheap. Show me the code. - Linus Torvalds",
            "That's the thing about people who think they hate computers. What they really hate is lousy programmers. - Larry Niven",
            "The act of describing a program in unambiguous detail and the act of programming are one and the same. - Kevlin Henney",
            "The best programs are written so that computing machines can perform them quickly and so that human beings can understand them clearly. A programmer is ideally an essayist who works with traditional aesthetic and literary forms as well as mathematical concepts, to communicate the way that an algorithm works and to convince a reader that the results will be correct. - Donald E. Knuth, Selected Papers on Computer Science",
            "The computer programmer is a creator of universes for which he alone is the lawgiver. No playwright, no stage director, no emperor, however powerful, has ever exercised such absolute authority to arrange a stage or field of battle and to command such unswervingly dutiful actors or troops. - Joseph Weizenbaum",
            "The most disastrous thing that you can ever learn is your first programming language. - Alan Kay",
            "The most important property of a program is whether it accomplishes the intention of its user. - C.A.R. Hoare",
            "Truth can only be found in one place: the code. - Robert C. Martin, Clean Code: A Handbook of Agile Software Craftsmanship",
            "Unix will give you enough rope to shoot yourself in the foot. If you didn’t think rope would do that, you should have read the man page. - mhoye",
            "Walking on water and developing software from a specification are easy if both are frozen. - Edward V. Berard",
            "When they first built the University of California at Irvine they just put the buildings in. They did not put any sidewalks, they just planted grass. The next year, they came back and put the sidewalks where the trails were in the grass. Perl is just that kind of language. It is not designed from first principles. Perl is those sidewalks in the grass. - Larry Wall",
            "when you don't create things, you become defined by your tastes rather than ability. your tastes only narrow & exclude people. so create. - Why The Lucky Stiff",
            "When your hammer is C++, everything begins to look like a thumb. - Steve Haflich",
            "You've baked a really lovely cake, but then you've used dog shit for frosting. - Steve Jobs",
        ],
    },
    {
        category: constants.CATEGORY_PROGRAMMING_QUOTES,
        language: constants.LANG_KOREAN,
        sentences: [
            "Boolean 이 좋은 것은 당신이 설령 잘못했더라도 한 비트만 바꾸면 된다는 것이다.",
            "결국 당신 코드를 유지보수하게 될 친구가 당신이 어디에 사는지 아는 광폭한 싸이코패스가 될 것이라고 여기고 코드를 작성하라.",
            "낙관론은 프로그래머라는 직업 관점에서 위험물이다. 피드백이 해결책이다. - Kent Beck",
            "당신 대부분은 프로그래머의 미덕과 친숙하다. 미덕은 세 가지인데 당연히 게으름, 성급함, 오만이다.",
            "당신은 소프트웨어 품질을 추구할 수도 있고 포인터 연산을 할 수도 있다. 그러나 두 개를 동시에 할 수는 없다. - Bertrand Meyer",
            "당신이 6개월 이상 한 번도 보지 않은 코드는 다른 사람이 다시 만드는 게 훨씬 더 나을 수 있다. - Eagleson's Law",
            "동작하지 않는 훌륭한 설계의 코드보다는 그래도 작동하는 미흡한 설계의 코드가 낫다.",
            "말은 쉽지, 코드를 보여줘. - Linus Torvalds",
            "무료 소프트웨어를 두려워하는 사람들은 자신들의 제품이 그것보다 못하기 때문이다. - David Emery",
            "세상에는 딱 두 가지 프로그래밍 언어가 있다. 사람들이 욕하는 언어와 아무도 사용하지 않는 언어. - Bjarne Stroustrup",
            "소프트웨어 설계를 구성하는 데에는 두 가지 방법이 있다. 한가지 방법은 아주 단순하게 만들어서 명백히 결함이 없는 것이다. 그리고 다른 방법은 명백한 결함이 없을 정도로 아주 복잡하게 만드는 것이다.",
            "아무리 구조가 잘 되어 있더라도 프로그래머가 나쁜 프로그램을 만드는 것을 방지하는 프로그래밍 언어는 없다. - Larry Flon",
            "애초에 디버깅은 코드를 작성하는 것 보다 배나 힘들다. 그러니 코드를 최대한 꼼꼼하게 작성하는 사람은 당연히 디버그할 정도로 똑똑하지 않은 것이다.",
            "에러 없는 프로그램을 만드는 데는 두가지 방법이 있다. 그런데 세번째 것만 작동한다. -  Alan J. Perlis",
            "올바로 작동하지 않는다고 걱정하지 마라. 만일 모든 게 잘 된다면 굳이 당신이 일할 이유가 없다. - Mosher's Law of Software Engineering",
            "완벽함이란 더 이상 추가할 것이 없을 때 이루어지는 것이 아니라 더 이상 버릴 것이 없을 때 이루어진다. - 에릭 레이몬드",
            "우리의 소프트웨어는 의미있는 요구사항을 거의 가지고 있지 않다. 그럼에도 불구하고 유일한 성공의 척도는 우리의 솔루션이 갈팡질팡하는 고객의 문제점을 해결해 줄 수 있느냐 하는 것이다. - Jeff Atwood",
            "좋은 디자인은 그 때문에 소모되는 비용보다 빠르게 가치가 쌓인다. - Thomas C. Gale",
            "좋은 프로그래머는 자신들의 두뇌를 사용한다. 그러나 좋은 가이드라인은 모든 케이스를 고려해야만 하는 노력을 줄여준다. - Francis Glassborow",
            "최고의 프로그래머는 그냥 좋은 프로그래머들보다 조금 더 나은 게 아니다. 그들은 어떻게 측정하던 간에 보통 사람들 보다 한 자리 수 이상이다. : 창의력, 스피드, 설계능력, 문제해결 능력까지. - Randall E. Stross",
            "컴퓨터 언어를 설계하는 것은 공원을 산책하는 것과 같다. '쥬라기 공원!!!' - Larry Wall",
            "코드 수를 기준으로 프로그램의 진도를 측정하는 것은 비행기 제작 진도를 무게로 측정하는 것과 같다. - Bill Gates",
            "코딩이란 사회조직에서 도굴보다는 위면서 관리의 바로 밑 어디엔가 위치하는 직업이다. - Gerald Weinberg",
            "항상 이런 생각으로 개발에 임하라. '내 소스를 유지보수하게 되는 개발자가 내가 어디 살고 있는지 알고 있는 과격한 사이코패스일 것이다.' - Martin Golding",
            "훌륭한 기계공은 일반 기계공보다 몇 배의 급여를 더 높이 받는다. 그러나 훌륭한 코드를 만들어내는 개발자는 일반적인 개발자보다 1만배 이상의 가치가 있다. - Bill Gates",
            "훌륭한 코드는 훌륭한 문서보다 낫다. - Steve McConnell",            
        ],
    }
];

export default quotes;
