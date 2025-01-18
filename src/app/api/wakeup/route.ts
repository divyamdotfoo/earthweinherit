import { Database } from "@/supabase/types";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
const testEmbedding = [
  0.02732295, 0.049073268, 0.12259787, 0.032525968, 0.029597493, 0.0527694,
  0.05274097, -0.020556184, 0.02226209, 0.05103506, 0.051859584, -0.0046130577,
  -0.058398895, 0.00910528, -0.008017764, -0.04955661, 0.019290969, 0.04810659,
  0.05828517, 0.10536821, 0.04151041, 0.0050395345, 0.0063260733, 0.06630293,
  -0.06101462, -0.047537953, -0.027195007, 0.079836465, 0.05598219,
  -0.016462006, 0.09433667, -0.03147399, -0.06817943, -0.01883606, 0.010796972,
  0.02645578, -0.055470422, -0.015822291, 0.019276753, 0.036705438, 0.05311058,
  -0.0822816, -0.066814706, -0.022191012, -0.051859584, 0.011742329, -0.0319289,
  0.0024557959, -0.052229196, 0.0061199428, 0.007040422, 0.00044669007,
  0.059024394, -0.07261479, 0.04159571, 0.0103349555, -0.019589502, 0.022077285,
  -0.035340715, -0.03767212, -0.029028857, -0.03784271, -0.040941775,
  0.038070165, 0.049386017, 0.025688121, 0.0075131003, -0.022347387,
  -0.028104823, -0.003099065, 0.083532594, 0.044694774, 0.019831173,
  -0.04833404, -0.039491754, -0.0018587282, 0.033464216, -0.02725187,
  0.03448776, -0.0018249655, 0.01900665, 0.0533949, 0.048618358, 0.027536187,
  -0.029455334, -0.01606396, -0.03528385, 0.04037314, -0.13237841, -0.023214556,
  0.005025319, 0.006997774, -0.082907096, 0.04876052, 0.027777858, 0.00941803,
  0.016803188, -0.012346504, 0.033634808, 0.020868933, -0.010519762,
  -0.02008706, 0.025062623, 0.04193689, 0.06641666, 0.014685019, -0.0405153,
  0.025446452, 0.007125717, -0.043443773, -0.00806752, 0.011529091,
  -0.008493997, 0.03144556, -0.03462992, -0.021949342, -0.05879694, 0.06721275,
  0.00309018, -0.0017929797, 0.009297195, -0.025773417, 0.044097707,
  0.065506846, 0.033009306, -0.05279783, 0.020911582, -0.06465389, -0.055043943,
  -0.012908032, 0.047111474, -0.0368476, 0.005018211, -0.040458437, 0.013213674,
  0.007260768, -0.02836071, -0.04512125, -0.021380706, 0.027209222, 0.010157256,
  0.045519296, 0.06562057, 0.07159124, -0.058029283, 0.0014438018, -0.052854694,
  0.053338036, -0.07551483, 0.005611724, 0.05638024, 0.024664577, -0.022034636,
  0.02295867, -0.057887122, -0.04179473, 0.008749883, 0.062834255, 0.036591712,
  -0.00023211891, 0.015054632, 0.03937803, 0.018025754, -0.00296046,
  0.016732108, 0.0028858266, -0.004972009, -0.001010217, -0.03178674,
  0.0019102609, -0.0724442, 0.024053294, 0.014599724, -0.0019298077,
  -0.0006525984, -0.022205228, -0.012829845, 0.0035664125, 0.015793858,
  0.05819987, -0.07778937, 0.03175831, -0.05942244, -0.04193689, 0.015864938,
  0.03750153, -0.05925185, 0.024294963, 0.03161615, 0.018011538, -0.017570846,
  0.039577052, 0.0349711, 0.025204781, 0.011024427, -0.010207012, 0.024906248,
  -0.01509728, -0.018551743, 0.0049506854, -0.034089714, -0.009752104,
  0.0607303, -0.041425116, 0.01914881, 0.0013265207, 0.0007645486, 0.0059919995,
  0.015850723, -0.022191012, 0.011799192, -0.028787186, 0.01620612, 0.035653464,
  -0.0028414018, 0.023712112, -0.0736952, 0.017442903, 0.0041332715,
  0.051120356, 0.04435359, -0.04381339, 0.011401148, -0.0220915, -0.03639269,
  0.01187738, -0.056294944, 0.0047658784, 0.050153676, -0.045433998,
  0.014159031, 0.03244067, 0.016049745, -0.0270102, -0.07608347, -0.10269562,
  0.035625033, -0.00834473, 0.028133254, -0.04512125, 0.008749883, 0.013220782,
  0.0035557507, -0.03755839, 0.012765873, 0.048987973, -0.01946156, -0.03508483,
  0.05925185, 0.01734339, 0.051205654, -0.02049932, 0.03465835, -0.0020026641,
  -0.035482872, -0.032326944, 0.0423918, -0.00096223835, -0.0607303,
  -0.038809393, -0.030734764, 0.017528199, 0.009233223, 0.015139928,
  -0.04446732, 0.0024877815, -0.05495865, 0.00044491308, 0.024707224,
  -0.026356269, 0.016860051, 0.01803997, -0.0071150553, -0.066359796,
  -0.043898683, 0.042562388, 0.07636779, 0.017542414, -0.02565969, 0.026654802,
  -0.025361156, -0.019106163, 0.041396685, -0.02988181, -0.03431717,
  -0.036961325, -0.026356269, 0.047623247, -0.011301636, 0.0058533945,
  0.06761079, 0.026029304, -0.001888937, -0.019888036, -0.03209949, -0.02925631,
  -0.03468678, -0.0073922654, -0.04435359, -0.029625924, 0.010384711,
  -0.0019031529, -0.057574373, -0.0013105278, -0.01897822, -0.042533956,
  0.003920033, -0.029824946, 0.023768976, -0.015793858, 0.036932893,
  0.030137697, 0.08455614, -0.0017281197, -0.025503315, -0.03656328, 0.06647352,
  -0.043614365, -0.022702783, -0.00060861796, -0.030422015, -0.019418912,
  -0.013405588, -0.049528178, 0.026057735, 0.0069160326, -0.0055726306,
  0.08188355, -0.08660323, -0.06607548, 0.013099947, 0.024778305, 0.043216318,
  0.052229196, -0.06618921, -0.011230556, 0.008437133, -0.003086626,
  0.056124352, 0.015580621, -0.03508483, -0.047452655, 0.02202042, 0.03286715,
  0.033492647, 0.017926242, 0.020627264, -0.0686912, 0.042164344, 0.03843978,
  0.05177429, 0.00022578839, -0.08506791, 0.0027312287, -0.059024394,
  0.10138776, 0.015438462, -0.005131938, 0.037700552, 0.017513983, -0.03875253,
  -0.008749883, 0.0626068, 0.016191904, 0.007321186, -0.009467786, -0.038240757,
  0.049357586, -0.0048049726, 0.022375818, -0.00830919, -0.011799192,
  -0.12168806, 0.05896753, -0.028062176, -0.0016046191, 0.014429133,
  0.047537953, -0.016817404, 0.008444241, 0.035198554, -0.0035930674,
  0.007267876, 0.037473097, -0.010548194, 0.014969337, -0.00033896024,
  -0.051888015, -0.012609499, 0.010178581, 0.10383289, 0.038411345, 0.044922225,
  -0.0012527757, 0.0053380686, 0.027337166, 0.025034191, 0.08762678,
  0.033776965, -0.018054185, -0.0039697886, 0.025247429, -0.013348725,
  -0.028872482, 0.025673905, -0.025432235, -0.051404674, -0.020485105,
  0.0008791642, -0.042477094, 0.015225223, 0.0034686783, 0.012858276,
  0.022916023, 0.021821398, 0.03099065, -0.051290948, 0.049812496, 0.013704122,
  -0.07989333, 0.019248322, -8.474006e-5, 0.049698766, -0.048987973, 0.06937356,
  -0.0028147472, 0.013277645, -0.055214535, 0.019973332, -0.032326944,
  -0.050182108, 0.009005769, 0.04008882, -0.009282979, -0.021508649,
  0.042818274, -0.0072110123, -0.013220782, 0.02042824, 0.024280747,
  0.064597026, 0.0046414896, 0.011088397, 0.007164811, -0.009887154,
  -0.01683162, 0.04151041, 0.03400442, 0.0005295421, -0.058683213, -0.02081207,
  0.05851262, 0.03465835, -0.0033105265, 0.00914082, 0.016433574, 0.076936424,
  0.02708128, 0.03718878, -0.025688121, -0.013092839, 0.027479324, 0.088877775,
  -0.02783472, -0.041993752, 0.053366467, 0.0120550785, -0.02153708,
  -0.0029284742, 0.017542414, -0.00564371, -0.013142594, -0.007896929,
  -0.049840927, 0.024366044, 0.025474884, -0.0054660114, -0.088366,
  -0.0035717436, -0.027550403, 0.004186581, -0.008188356, -0.029512197,
  -0.017471334, -0.018921355, -0.051916447, 0.021451784, -0.008039088,
  0.011465119, -0.03528385, 0.018395368, -0.029569061, 0.07261479, -0.010327848,
  0.06755393, -0.054702763, -0.0010279869, -0.0626068, 0.0065393117,
  0.048277177, 0.044581044, -0.0050111027, -0.06101462, -0.089332685,
  0.017926242, -0.01613504, 0.044183, 0.008465565, 0.008920474, -0.0019724553,
  -0.01755663, -0.042846706, -0.013803634, 0.006876939, 0.012111942,
  0.017272312, -0.026427347, 0.029014641, 0.02600087, -0.016774755, 0.041766297,
  0.002299421, 0.06266367, 0.059024394, -0.029597493, 0.03099065, 0.046485975,
  -0.04159571, -0.021025307, -0.07818742, 0.042022184, -0.036335826,
  -0.004584626, 0.041112367, -0.007655259, -0.01683162, 0.059081256,
  -0.026910689, 0.0037423342, -0.035511304, 0.0069800043, -0.03721721,
  -0.06226562, -0.032753423, 0.011123938, 0.032298513, -0.06249307, 0.026811177,
  0.0077903103, 0.021750318, 0.022674352, -0.06363034, 0.0049115918,
  -0.050892904, 0.028957777, -0.005647264, 0.010398927, 0.02797688,
  -0.017115938, 0.02153708, 0.012254101, 0.03113281, -0.039292734, -0.019205673,
  0.035312284, 0.025204781, 0.03320833, 0.08302082, -0.0423918, 0.0073709413,
  -0.0007641043, -0.03354951, -0.014279866, -0.0017174578, 0.022077285,
  -0.03701819, 0.043216318, -0.028175903, 0.016746324, -0.011955568,
  -0.0046983534, -0.047139905, -0.0064398004, -0.0638578, -0.03289558,
  0.00072900887, -0.019120378, 0.017471334, -0.02939847, -0.036449555,
  0.015623268, -0.045832045, -0.0013149702, -0.0030084387, -0.0193194,
  0.042448662, -0.016092394, -0.031559285, 0.00810306, 0.0035930674,
  -0.004723231, 0.0020932904, -0.040458437, -0.025375372, 0.0027294517,
  -0.062436208, 0.017144369, -0.017499765, 0.0021945788, -0.0306779,
  -0.014741883, 0.010825404, 0.026541075, 0.038553506, -0.028886698,
  -0.025375372, -0.0016481553, 0.025915576, -0.01825321, 0.0491017, 0.007804526,
  0.045689885, 0.012453124, -0.034914237, 0.033776965, 0.016675245,
  -0.033634808, 0.0015299857, -0.03323676, 0.0521439, 0.040287845, -0.02614303,
  -0.016021313, 0.0035877363, 0.016632596, -0.025005758, -0.0025464222,
  0.052968424, -0.010484222, -0.0368476, 0.017187016, -0.028716108, 0.005441134,
  -0.03244067, 0.05100663, 0.025361156, -0.024820952, -0.023740543,
  -0.011806301, -0.009922694, -0.01211905, -0.012844061, -0.08108746,
  0.0043607256, 0.0040693, 0.03053574, 0.022390034, 0.04307416, -0.039804503,
  0.0021945788, -0.059479304, -0.0398898, -0.021110604, 0.001697911,
  -0.0039484645, -0.0027649915, 0.04085648, 0.0043784957, 0.01083962,
  0.004993333, -0.0939955, 0.009979558, 0.00020590835, 0.040685892,
  -0.0073140776, 0.021352274, -0.011813409, -0.010448682, -0.03895155,
  -0.0011328291, 0.004342956, 0.01866547, -0.029370038, -0.0074562365,
  -0.028175903, -0.00038471766, 0.03227008, -0.026541075, -0.009652592,
  0.024948895, 0.008813854, -0.03897998, 0.014187463, 0.0016099501,
  -0.023385147, 0.036165237, 0.038837824, 0.038041733, -0.01789781,
  -0.060332257, -0.047310498, 0.029995538, -0.056323376, 0.00014149258,
  0.056323376, -0.017855164, -0.009368274, 0.018068401, 0.025588611,
  0.004993333, -0.007527316, -0.0021466, -0.011657033, -0.023214556,
  -0.02479252, -0.0095957285, 0.045718316, -0.05242822, 0.03656328,
  -0.022290522, -0.034089714, 0.0029409132, -0.04913013, 0.015466893,
  0.017371824, -0.0066352687, -0.037103485, 0.03144556, 0.017030641, 0.01533895,
  -0.045064386, 0.030564174, 0.00806752, 0.013697014, -0.049499746, 0.039690778,
  -0.006208792, -0.059877347, 0.010199904, 0.028517084, -0.0027632145,
  -0.017641924, 0.019163026, -0.039577052, 0.053821377, -0.03986137,
  -0.026015088, -0.01953264, 0.016220335, -0.013718339, -0.051376242,
  0.00754864, 0.009880046, 0.009709456, 0.010960455, -0.0061661443, -0.04165257,
  -0.0017476665, 0.008771207, 0.0076268273, -0.0022603273, -0.015239439,
  -0.01970323, -0.032668125, -0.004492223, 0.029796515, 0.019774308,
  -0.004325186,
];

export async function GET() {
  const store = await headers();
  const secret = store.get("secret");
  if (!secret || secret !== process.env.SECRET!)
    return NextResponse.json({}, { status: 500 });

  const supa = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  await Promise.all([
    supa.from("page").select("*").limit(1),
    supa.rpc("search", {
      embedding: testEmbedding as unknown as string,
      match_count: 2,
      match_threshold: 0.2,
    }),
  ]);
  return NextResponse.json({}, { status: 200 });
}
